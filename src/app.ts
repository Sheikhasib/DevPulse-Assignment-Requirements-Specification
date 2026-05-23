import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import loggeer from "./middleware/logger";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { authRouter } from "./modules/auth/auth.route";
import { issueRouter } from "./modules/issue/issue.route";

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(loggeer); // Custom Middleware

// Root Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to BugNest Issue Tracker API",
  });
});

// Auth Routes
app.use("/api/auth", authRouter);

// Issue Routes
app.use("/api/issues", issueRouter);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
