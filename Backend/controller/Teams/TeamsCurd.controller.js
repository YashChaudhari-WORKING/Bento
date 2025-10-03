const { teamSchema } = require("../../validators/auth.validators");
const Teams = require("../../models/Teams");
const Membership = require("../../models/Membership");

// Create Team
exports.createTeam = async (req, res) => {
  try {
    const parsed = teamSchema.safeParse(req.body || {});
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        msg: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { name, slug, workspaceId, description } = parsed.data;
    const userId = req.user.userId;

    // Check if user is workspace member
    const membership = await Membership.findOne({ userId, workspaceId });
    if (!membership) {
      return res.status(403).json({
        success: false,
        msg: "You don't have access to this workspace",
      });
    }

    // Check if team slug already exists
    const existingTeam = await Teams.findOne({
      workspaceId,
      slug: slug.toUpperCase(),
    });

    if (existingTeam) {
      return res.status(409).json({
        success: false,
        msg: "Team with this identifier already exists",
      });
    }

    const team = await Teams.create({
      name,
      slug: slug.toUpperCase(),
      description: description || "",
      workspaceId,
      createdBy: userId,
      memberships: [{ userId, role: "admin" }],
    });

    return res.status(201).json({
      success: true,
      msg: "Team created",
      data: team,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
};

// Get All Teams with Members
exports.getTeams = async (req, res) => {
  try {
    const { workspaceId } = req.query;
    const userId = req.user.userId;

    // Check workspace access
    const membership = await Membership.findOne({ userId, workspaceId });
    if (!membership) {
      return res.status(403).json({
        success: false,
        msg: "You don't have access to this workspace",
      });
    }

    const teams = await Teams.find({ workspaceId, archived: false })
      .populate("memberships.userId", "name email avatarUrl")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: teams,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
};
