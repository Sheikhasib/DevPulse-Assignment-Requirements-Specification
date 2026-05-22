import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

// 1. User Registration

router.post("/signup", authController.signup);

// 2. User Login

router.post("/login", authController.login);

// Export Auth Router to be used as middleware in app.ts
export const authRouter = router;
