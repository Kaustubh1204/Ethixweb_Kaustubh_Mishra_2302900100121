const leadsService = require("../services/leads.service");

const submitLead = async (req, res, next) => {
  try {
    const lead = await leadsService.submitLead(req.body);
    return res.status(201).json({
      success: true,
      data: lead,
      message: "Your enquiry has been successfully submitted.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitLead,
};
