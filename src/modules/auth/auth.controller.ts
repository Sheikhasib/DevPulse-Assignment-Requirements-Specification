import type { Request, Response } from "express";
import authService from "./auth.service";
import sendResponse from "../../utils/sendResponse";

// 1. Signup

const signup = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    const user = await authService.createUser(req.body);

    // If user is not created
    if (!user) {
      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "User not created",
      });

      return;
    }

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

// 2. Login

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await authService.validateUser(email, password);

    // If user email not found
    if (!user) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found",
      });

      return;
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

// Export Auth Controller to be used as middleware in auth.route.ts
export const authController = {
  signup,
  login,
};
