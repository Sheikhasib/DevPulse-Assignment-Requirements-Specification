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

const getAllIssuesFromDB = async (
  sort?: string,
  type?: string,
  status?: string,
) => {
  // Build dynamic query based on filters
  let query = `SELECT * FROM issues WHERE 1=1`;
  const params: any[] = [];

  if (type) {
    params.push(type);
    query += ` AND type = $${params.length}`;
  }

  if (status) {
    params.push(status);
    query += ` AND status = $${params.length}`;
  }

  // Sorting
  query += ` ORDER BY created_at ${sort === "oldest" ? "ASC" : "DESC"}`;

  const issues = await pool.query(query, params);

  //   const issues = await pool.query(
  //     `
  //     SELECT * FROM issues
  //     `
  //   );

  // If no issues found, return empty array
  if (issues.rows.length === 0) {
    return [];
  }

  // Fetching reporters
  const reporterIds = issues.rows.map((issue) => issue.reporter_id);

  const reporters = await pool.query(
    `
        SELECT id, name, role FROM users
        WHERE id = ANY($1)
    `,
    [reporterIds],
  );

  // Add reporters to issues
  issues.rows.forEach((issue) => {
    const reporter = reporters.rows.find((r) => r.id === issue.reporter_id);
    if (reporter) {
      issue.reporter = reporter; // Add reporter to issue
    }
  });

  // Remove reporter_id from issues
  issues.rows.forEach((issue) => {
    delete issue.reporter_id;
  });

  return issues.rows.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: issue.reporter, // Add reporter
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  }));
};

// 5. Get Single Issue

const getSingleIssueFromDB = async (id: string) => {
  const issues = await pool.query(
    `
        SELECT * FROM issues
        WHERE id = $1
    `,
    [id],
  );

  // If no issue found, throw error
  if (issues.rows.length === 0) {
    throw new Error("Issue not found");
  }

  const issue = issues.rows[0];

  // Fetching reporter
  const reporter = await pool.query(
    `
        SELECT id, name, role FROM users
        WHERE id = $1
    `,
    [issue.reporter_id],
  );

  // Add reporter to issue
  issue.reporter = reporter.rows[0];

  // Remove reporter_id from issue
  delete issue.reporter_id;

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: issue.reporter, // Add reporter
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

// Export Issue Service to be used as middleware in issue.controller.ts
export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
};
