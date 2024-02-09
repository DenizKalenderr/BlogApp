const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

router.get("/register", authController.get_register);
router.post("/register", authController.post_register);

router.get("/login", authController.get_login);
router.post("/login", authController.post_login);

router.get("/reset-password", authController.get_reset);
router.post("/reset-password", authController.post_reset);

router.get("/new-password/:token", authController.get_newpassword);
router.post("/new-password", authController.post_newpassword);

router.get("/logout", authController.get_logout);

module.exports = router;