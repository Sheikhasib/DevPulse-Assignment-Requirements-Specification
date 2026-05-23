import { pool } from "../../db";
import type { IIssue } from "./issue.interface";

// 3. Create Issue

const createIssueIntoDB = async (issue: IIssue) => {
  const { title, description, type, status, reporter_id } = issue;

  const result = await pool.query(
    `
      INSERT INTO issues (title, description, type, status, reporter_id)
      VALUES ($1, $2, $3, COALESCE($4, 'open'), $5)
      RETURNING *
    `,
    [title, description, type, status, reporter_id],
  );

  return result;
};

// 4. Get All Issues

const getAllIssuesFromDB = async () => {
  const result = await pool.query(
    `
        SELECT * FROM issues
    `,
  );

  return result;
};

// Export Issue Service to be used as middleware in issue.controller.ts
export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
};
