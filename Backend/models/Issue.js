const mongoose = require("mongoose");
const { Schema } = mongoose;

const IssueSchema = new mongoose.Schema(
  {
    // Core fields
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },

    // Auto-generated identifier (TEAM-123)
    identifier: {
      type: String,
      required: true,
      unique: true,
    },
    number: {
      type: Number,
      required: true,
    },

    // Status and priority
    status: {
      type: String,
      enum: ["backlog", "todo", "in_progress", "done"],
      default: "backlog",
    },
    priority: {
      type: String,
      enum: ["no_priority", "low", "medium", "high", "urgent"],
      default: "no_priority",
    },

    // Relationships
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    assigneeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null, // Can be unassigned
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes
IssueSchema.index({ teamId: 1, number: 1 }, { unique: true });
IssueSchema.index({ workspaceId: 1 });
IssueSchema.index({ assigneeId: 1 });

// Auto-generate identifier before saving
IssueSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      // Get team for identifier
      const team = await mongoose.model("Team").findById(this.teamId);
      if (!team) {
        throw new Error("Team not found");
      }

      // Get next number for this team
      const lastIssue = await this.constructor
        .findOne({ teamId: this.teamId })
        .sort({ number: -1 });

      this.number = lastIssue ? lastIssue.number + 1 : 1;
      this.identifier = `${team.slug}-${this.number}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model("Issue", IssueSchema);
