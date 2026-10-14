const { Router } = require("express");
const {
  getLeads,
  getLeadById,
  updateLeadStatus,
  deleteLead,
} = require("../controllers/admin-leads.controller");
const requireAdmin = require("../middleware/require-admin");
const validate = require("../middleware/validate");
const { updateLeadStatusSchema } = require("../schemas/lead.schema");

const router = Router();

// Apply requireAdmin to all admin leads routes
router.use(requireAdmin);

router.get("/admin/leads", getLeads);
router.get("/admin/leads/:id", getLeadById);
router.patch("/admin/leads/:id", validate(updateLeadStatusSchema), updateLeadStatus);
router.delete("/admin/leads/:id", deleteLead);

module.exports = router;
