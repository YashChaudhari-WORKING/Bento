const Workspace = require("../../models/Workspace");
const Membership = require("../../models/Membership");
const Teams = require("../../models/Teams");
const { workSpaceSchema } = require("../../validators/auth.validators");

const generateUniqueTeamSlug = async (baseName, workspaceId) => {
  const base = baseName
    .trim()
    .slice(0, 4)
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
  let candidate = base;
  let suffix = 0;

  while (await Teams.findOne({ slug: candidate, workspaceId })) {
    suffix++;
    candidate = `${base}-${suffix}`;
  }

  return candidate;
};

const createWorkSpace = async (req, res) => {
  try {
    const parsed = workSpaceSchema.safeParse(req.body || {});
    const user = req.user;
    if (!parsed.success) {
      const flatErrors = parsed.error.flatten();
      return res.status(400).json({
        success: false,
        msg: "Validation error",
        error: flatErrors.fieldErrors,
      });
    }
    const { name, slug } = parsed.data;
    const existingSlug = await Workspace.findOne({ slug });
    if (existingSlug)
      return res.status(409).json({
        success: false,
        msg: "These WorkSpace Slug Already Taken..",
      });
    const workspace = await Workspace.create({
      name,
      slug,
      createdBy: user.userId,
    });

    await Membership.create({
      userId: user.userId,
      workspaceId: workspace._id,
      role: "admin",
    });

    const teamSlug = await generateUniqueTeamSlug(slug, workspace._id);

    const team = await Teams.create({
      name: slug,
      slug: teamSlug,
      workspaceId: workspace._id,
      createdBy: user.userId,
      memberships: [
        {
          userId: user.userId,
          role: "admin",
        },
      ],
    });

    return res.status(201).json({
      success: true,
      msg: "Workspace and default team created",
      workspace: {
        _id: workspace._id,
        slug: workspace.slug,
        name: workspace.name,
        role: "admin",
      },
      team: {
        _id: team._id,
        name: team.name,
        slug: team.slug,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Unexpected error occurred",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};
module.exports = { createWorkSpace };
