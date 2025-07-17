const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth.middleware");
const {
  createWorkSpace,
} = require("../../controller/workspace/createWorkspace.controller");
router.post("/createworkspace", authMiddleware, createWorkSpace);
module.exports = router;
