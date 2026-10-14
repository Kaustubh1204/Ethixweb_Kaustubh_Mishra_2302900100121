const { Router } = require("express");
const { submitLead } = require("../controllers/leads.controller");
const validate = require("../middleware/validate");
const { createLeadSchema } = require("../schemas/lead.schema");
const { leadSubmitLimiter } = require("../middleware/rate-limit");

const router = Router();

router.post("/leads", leadSubmitLimiter, validate(createLeadSchema), submitLead);

module.exports = router;
