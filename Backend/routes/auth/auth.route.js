const express = require("express");
const router = express.Router();
const { signupController } = require("../../controller/auth/signup.controller");
const { loginController } = require("../../controller/auth/login.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const { meController } = require("../../controller/auth/me.controller");
const { logout } = require("../../controller/auth/logout.controller");

router.post("/signup", signupController);
router.post("/login", loginController);

router.get("/me", authMiddleware, meController);
router.post("/logout", authMiddleware, logout);

module.exports = router;
