const mongoose = require("mongoose");
const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "General",
    },
    slug: {
      type: String,
      required: true,
      uppercase: true,
    },
    description: {
      type: String,
      default: "",
    },
    archived: {
      type: Boolean,
      default: false,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    memberships: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: {
          type: String,
          enum: ["admin", "member", "guest"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

TeamSchema.index({ workspaceId: 1, slug: 1 }, { unique: true });
module.exports = mongoose.model("Team", TeamSchema);
