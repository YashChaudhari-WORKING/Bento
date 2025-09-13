const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth.middleware");
const {
  createWorkSpace,
  workspaceValid,
} = require("../../controller/workspace/createWorkspace.controller");
router.post("/createworkspace", authMiddleware, createWorkSpace);
router.post("/workspaceValid", authMiddleware, workspaceValid);
module.exports = router;
