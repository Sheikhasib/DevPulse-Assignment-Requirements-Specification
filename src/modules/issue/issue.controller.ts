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
  const { sort, type, status } = req.query as {
    sort?: string;
    type?: string;
    status?: string;
  };

  try {
    const issues = await issueService.getAllIssuesFromDB(sort, type, status);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      //   message: "Retrieved all issues successfully",
      data: issues,
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

// 5. Get Single Issue

const getSingleIssue = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const issue = await issueService.getSingleIssueFromDB(id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      //   message: "Single issue retrieved successfully",
      data: issue,
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
  getSingleIssue,
};
