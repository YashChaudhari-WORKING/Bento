const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    return res
      .status(200)
      .send({ status: true, msg: "Logged out successfully." });
  } catch (error) {
    return res.status(500).send({ status: false, msg: "Error While Logout" });
  }
};

module.exports = { logout };
