const express = require("express");
const router = express.Router();
const { signupController } = require("../../controller/auth/signup.controller");
const { loginController } = require("../../controller/auth/login.controller");
const authMiddleware = require("../../middleware/auth.middleware");

router.post("/signup", signupController);
router.get("/test", authMiddleware, (req, res) => {
  return res.send("yup its working woo we learn new auth and secure too");
});
router.post("/login", loginController);
module.exports = router;
