import jwt, { type JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import sendResponse from "../utils/sendResponse";
import config from "../config";
import { pool } from "../db";
import type { ROLES } from "../types";

const auth = (...roles: ROLES[]) => {
  // ...roles: ROLES[] => rest is an array of operator

  return async (req: Request, res: Response, next: NextFunction) => {
    console.log(roles);

    try {
      const token = req.headers.authorization?.split(" ")[1];
      // console.log(token);

      // Check if the token exists or not
      if (!token) {
        return sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized Access!!",
        });
      }

      // Verifying the token using jwt to get the email verification
      const decoded = jwt.verify(token, config.jwt_secret) as JwtPayload;
      //   console.log(decoded);

      const userData = await pool.query(
        `
        SELECT * FROM users
        WHERE email = $1
       `,
        [decoded.email],
      );
      //   console.log(userData);

      const user = userData.rows[0];
      //   console.log(user);

      // If user is not found into the database
      if (userData.rows.length === 0) {
        return sendResponse(res, {
          statusCode: 404,
          success: false,
          message: "User not found!!",
        });
      }

      // Check if the user has the required role or not
      if (roles.length && !roles.includes(user.role)) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Forbidden Access!!",
        });
      }

      // Attach the "user" to the request object
      req.user = decoded;

      next();
    } catch (error) {
      next(error); // Pass the error to the next middleware
    }
  };
};

export default auth;
