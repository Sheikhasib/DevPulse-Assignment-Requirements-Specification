import bcrypt from "bcryptjs";
import type { RUser } from "../../types";
import { pool } from "../../db";
import jwt, { type SignOptions } from "jsonwebtoken";
import config from "../../config";

class AuthService {
  // 1. Create User
  async createUser(user: RUser & { password: string }) {
    const { name, email, password, role } = user;

    const hashPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
        INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
      [name, email, hashPassword, role],
    );

    const newUser = result.rows[0];

    // Remove password_hash
    delete newUser.password_hash;

    return newUser;
  }

  // 2. Validate User
  async validateUser(email: string, password: string) {
    const userData = await pool.query(
      `
        SELECT * FROM users
        WHERE email = $1
        `,
      [email],
    );

    const user = userData.rows[0];

    // If user is not found into the database
    if (userData.rowCount === 0) {
      throw new Error("User not found");
    }

    // Compare the password using bcrypt in between server and database
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);

    // Check if the password is correct or not
    if (!isPasswordMatch) {
      throw new Error("Invalid password");
    }

    // Generate JWT Token

    const jwtPayload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    const accessToken = jwt.sign(jwtPayload, config.jwt_secret, {
      expiresIn: config.jwt_secret_expires_in,
    } as SignOptions);

    // Remove password_hash
    delete user.password_hash;

    return {
      token: accessToken,
      user: user,
    };
  }
}

export default new AuthService();
