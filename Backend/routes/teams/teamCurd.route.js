const express = require("express");
const router = express.Router();
const {
  createTeam,
  getTeams,
} = require("../../controller/Teams/TeamsCurd.controller");
const auth = require("../../middleware/auth.middleware");

// All routes require authentication
router.use(auth);

// Create team
router.post("/", createTeam);

// Get all teams for workspace
router.get("/", getTeams);

module.exports = router;
