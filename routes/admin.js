//admin.js
const express = require("express");
const router = express.Router();

router.route("/login").post((req, res) => {
  const { password } = req.body;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (password === ADMIN_PASSWORD) {
    res.json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});
module.exports = router;
