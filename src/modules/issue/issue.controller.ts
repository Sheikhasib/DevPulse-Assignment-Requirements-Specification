// 3. Create Issue

import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { issueService } from "./issue.service";

const createIssue = async (req: Request, res: Response) => {
  //   console.log("From issue controller: ", req.user);
  const issueData = {
    ...req.body,
    reporter_id: req.user!.id, // extract from JWT, not body
  };
  try {
    const issue = await issueService.createIssueIntoDB(issueData); // req.user.id is the id of the user who is creating the issue

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: issue.rows[0],
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

// 4. Get All Issues

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const issues = await issueService.getAllIssuesFromDB();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Retrieved all issues successfully",
      //   data: issues.rows[0],
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

// Export Issue Controller to be used as middleware in issue.route.ts
export const issueController = {
  createIssue,
  getAllIssues,
};
