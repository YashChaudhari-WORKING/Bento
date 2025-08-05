const { loginSchema } = require("../../validators/auth.validators");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// user login route
const loginController = async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body || {});
    if (!parsed.success) {
      const flatErrors = parsed.error.flatten();
      return res.status(400).json({
        success: false,
        msg: "Validation error",
        error: flatErrors.fieldErrors,
      });
    }

    const { email, password } = parsed.data;
    console.log(email, password);

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res
        .status(401)
        .json({ success: false, msg: "No User Found With These Email" });
    const passCheck = await bcrypt.compare(password, existingUser.password);

    if (!passCheck)
      return res.status(401).json({ success: false, msg: "Invalid Password!" });

    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
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
module.exports = { loginController };
