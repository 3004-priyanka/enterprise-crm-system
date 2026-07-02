const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");

// Get all activities
router.get("/", async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Email Activity Log
router.post("/email", async (req, res) => {
  try {

    const { leadName, email } = req.body;

await Activity.create({
  leadName,
  action: `Email sent to ${email}`
});

    res.json({
      message: "Email Logged Successfully"
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
module.exports = router;