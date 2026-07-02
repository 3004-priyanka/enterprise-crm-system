


const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const Lead = require("../models/Lead");
const Activity = require("../models/Activity");





// Add Lead

router.post(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "Sales"),
  async (req, res) => {
    try {
      const lead = new Lead(req.body);
      await lead.save();
      
      await Activity.create({
        leadName: lead.name,
        action: "Lead Added"
      });
      
      res.status(201).json(lead); // Good practice to send 201 for creation
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get Leads
router.get(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "Sales"),
  async (req, res) => {
    try {
      const leads = await Lead.find();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update Lead
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "Sales"),
  async (req, res) => {
    try {
      const updatedLead = await Lead.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      // Fix: Check if lead exists before logging activity
      if (!updatedLead) {
        return res.status(404).json({ error: "Lead not found" });
      }

      await Activity.create({
        leadName: updatedLead.name,
        action: "Lead Updated"
      });

      res.json(updatedLead);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete Lead
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  async (req, res) => {
    try { // Fix: Added missing opening brace '{'
      const deletedLead = await Lead.findByIdAndDelete(req.params.id);

      // Fix: Check if lead exists before logging activity
      if (!deletedLead) {
        return res.status(404).json({ error: "Lead not found" });
      }

      await Activity.create({
        leadName: deletedLead.name,
        action: "Lead Deleted"
      });

      res.json({ message: "Lead Deleted Successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;