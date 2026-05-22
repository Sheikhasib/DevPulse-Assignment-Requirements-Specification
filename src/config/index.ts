import dotenv from "dotenv";
import path from "path";

dotenv.config({
  quiet: true,
  path: path.join(process.cwd(), ".env"),
});

const config = {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL as string,
  node_env: process.env.NODE_ENV as string,
  jwt_secret: process.env.JWT_SECRET as string,
  jwt_secret_expires_in: process.env.JWT_SECRET_EXPIRES_IN as string,
};

export default config;
