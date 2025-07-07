import mongoose, { Schema } from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.workspaceSchema ||
  mongoose.model("WorkSpace", workspaceSchema);
