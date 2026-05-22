import { Router } from "express";
import { issueController } from "./issue.controller";

const router = Router();

// 3. Create Issues

router.post("/", issueController.createIssue);

// Export Issue Router to be used as middleware in app.ts
export const issueRouter = router;
