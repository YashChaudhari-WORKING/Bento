import mongoose, { Schema } from "mongoose";

const MembershipSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    workspaceId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Workspace",
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "member", "viewer"],
      default: "member",
    },
  },
  {
    timestamps: true,
  }
);
MembershipSchema.index({ userId: 1, workspaceId: 1 }, { unique: true });

module.exports = mongoose.model("Membership", MembershipSchema);
