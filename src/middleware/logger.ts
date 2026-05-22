import type { NextFunction, Request, Response } from "express";

const loggeer = (req: Request, res: Response, next: NextFunction) => {
  console.log(
    `[${new Date().toLocaleString()}] -> ${req.method} -> ${req.url}`,
  );
  next();
};

export default loggeer;
