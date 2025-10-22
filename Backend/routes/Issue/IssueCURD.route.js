// routes/issueRoutes.js
const express = require("express");
const issueController = require("../../controller/Issue/IssueCURD.controller");
const authMiddleware = require("../../middleware/auth.middleware");

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// POST /api/issues - Create new issue
router.post("/", issueController.createIssue);

// GET /api/issues - Get all issues with filters
router.get("/", issueController.getIssues);

// GET /api/issues/:id - Get issue by MongoDB ID
router.get("/:id", issueController.getIssueById);

// GET /api/issues/identifier/:identifier - Get issue by identifier (TEAM-123)
router.get("/identifier/:identifier", issueController.getIssueByIdentifier);

module.exports = router;
