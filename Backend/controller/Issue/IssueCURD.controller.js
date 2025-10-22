// controllers/issueController.js
const Issue = require("../../models/Issue");
const Team = require("../../models/Teams");
const User = require("../../models/User");

const issueController = {
  // Create new issue
  createIssue: async (req, res) => {
    try {
      const {
        title,
        description,
        teamId,
        assigneeId,
        priority = "no_priority",
        status = "backlog",
      } = req.body;

      // Validation
      if (!title || !teamId) {
        return res.status(400).json({
          success: false,
          message: "Title and teamId are required",
        });
      }

      // Verify team exists and get workspace
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({
          success: false,
          message: "Team not found",
        });
      }

      // Verify assignee exists (if provided)
      if (assigneeId) {
        const assignee = await User.findById(assigneeId);
        if (!assignee) {
          return res.status(404).json({
            success: false,
            message: "Assignee not found",
          });
        }
      }

      // Create issue
      const issue = new Issue({
        title: title.trim(),
        description: description?.trim() || "",
        teamId,
        workspaceId: team.workspaceId,
        assigneeId: assigneeId || null,
        priority,
        status,
        createdBy: req.user.id,
      });

      await issue.save();

      // Populate references for response
      await issue.populate([
        { path: "teamId", select: "name slug" },
        { path: "assigneeId", select: "name email avatarUrl" },
        { path: "createdBy", select: "name email avatarUrl" },
      ]);

      res.status(201).json({
        success: true,
        message: "Issue created successfully",
        data: issue,
      });
    } catch (error) {
      console.error("Error creating issue:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create issue",
        error: error.message,
      });
    }
  },

  // Get all issues with filters
  getIssues: async (req, res) => {
    try {
      const {
        teamId,
        workspaceId,
        assigneeId,
        status,
        priority,
        page = 1,
        limit = 20,
      } = req.query;

      // Build filter object
      const filter = {};
      if (teamId) filter.teamId = teamId;
      if (workspaceId) filter.workspaceId = workspaceId;
      if (assigneeId) filter.assigneeId = assigneeId;
      if (status) filter.status = status;
      if (priority) filter.priority = priority;

      const skip = (page - 1) * limit;

      const issues = await Issue.find(filter)
        .populate("teamId", "name slug")
        .populate("assigneeId", "name email avatarUrl")
        .populate("createdBy", "name email avatarUrl")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Issue.countDocuments(filter);

      res.status(200).json({
        success: true,
        data: issues,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching issues:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch issues",
        error: error.message,
      });
    }
  },

  // Get single issue by ID
  getIssueById: async (req, res) => {
    try {
      const { id } = req.params;

      const issue = await Issue.findById(id)
        .populate("teamId", "name slug")
        .populate("assigneeId", "name email avatarUrl")
        .populate("createdBy", "name email avatarUrl");

      if (!issue) {
        return res.status(404).json({
          success: false,
          message: "Issue not found",
        });
      }

      res.status(200).json({
        success: true,
        data: issue,
      });
    } catch (error) {
      console.error("Error fetching issue:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch issue",
        error: error.message,
      });
    }
  },

  // Get issue by identifier (TEAM-123)
  getIssueByIdentifier: async (req, res) => {
    try {
      const { identifier } = req.params;

      const issue = await Issue.findOne({ identifier })
        .populate("teamId", "name slug")
        .populate("assigneeId", "name email avatarUrl")
        .populate("createdBy", "name email avatarUrl");

      if (!issue) {
        return res.status(404).json({
          success: false,
          message: "Issue not found",
        });
      }

      res.status(200).json({
        success: true,
        data: issue,
      });
    } catch (error) {
      console.error("Error fetching issue:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch issue",
        error: error.message,
      });
    }
  },
};

module.exports = issueController;
