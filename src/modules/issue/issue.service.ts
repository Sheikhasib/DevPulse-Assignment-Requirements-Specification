import { pool } from "../../db";
import type { Issue } from "../../types";

// 3. Create Issue

const createIssueIntoDB = async (issue: Issue) => {
  const { title, description, type, status, reporter_id } = issue;

  // check if the user exists or not
  const user = await pool.query(
    `
        SELECT * FROM users
        WHERE id = $1
    `,
    [reporter_id],
  );
  console.log(user);

  if (user.rows.length === 0) {
    throw new Error("User not found");
  }

  const result = await pool.query(
    `
      INSERT INTO issues (title, description, type, status, reporter_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
    [title, description, type, status, reporter_id],
  );

  return result;
};

// Export Issue Service to be used as middleware in issue.controller.ts
export const issueService = {
  createIssueIntoDB,
};
