import { Router } from "express";
import { issueController } from "./issue.controller";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../../types";

const router = Router();

// 3. Create Issues

router.post(
  "/",
  auth(USER_ROLES.contributor, USER_ROLES.maintainer),
  issueController.createIssue,
);

// 4. Get All Issues
router.get("/", issueController.getAllIssues);

// Export Issue Router to be used as middleware in app.ts
export const issueRouter = router;
