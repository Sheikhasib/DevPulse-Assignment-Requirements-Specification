import type { NextFunction, Request, Response } from "express";
import config from "../config";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //   console.error(err.stack); // Log the error

  res.status(500).json({
    success: false,
    message: err instanceof Error ? err.message : "Internal Server Error",
    stack:
      config.node_env === "development" && err instanceof Error
        ? err.stack
        : undefined,
  });
};

export default globalErrorHandler;
