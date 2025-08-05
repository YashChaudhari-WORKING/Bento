const User = require("../../models/User");
const Membership = require("../../models/Membership");
const Teams = require("../../models/Teams");

const meController = async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    const memberships = await Membership.find({ userId })
      .populate("workspaceId")
      .lean();

    const detailedMemberships = await Promise.all(
      memberships.map(async (membership) => {
        const workspace = membership.workspaceId;

        const teams = await Teams.find({
          workspaceId: workspace._id,
          "memberships.userId": userId,
        }).lean();

        const mappedTeams = teams.map((team) => {
          const member = team.memberships.find(
            (m) => m.userId.toString() === userId.toString()
          );
          return {
            _id: team._id,
            name: team.name,
            slug: team.slug,
            role: member?.role || "member",
          };
        });

        return {
          workspace: {
            _id: workspace._id,
            name: workspace.name,
            slug: workspace.slug,
          },
          role: membership.role,
          teams: mappedTeams,
        };
      })
    );

    return res.json({
      user,
      memberships: detailedMemberships,
    });
  } catch (error) {
    console.error("Error in /me:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { meController };
