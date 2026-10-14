const leadsService = require("../services/leads.service");

const getLeads = async (req, res, next) => {
  try {
    const { status, search, limit, offset } = req.query;
    const leads = await leadsService.getLeads({
      status,
      search,
      limit: limit ? parseInt(limit, 10) : 100,
      offset: offset ? parseInt(offset, 10) : 0,
    });
    const metrics = await leadsService.getMetrics();

    return res.status(200).json({
      success: true,
      data: {
        leads,
        metrics,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getLeadById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lead = await leadsService.getLeadById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `Lead with ID ${id} not found`,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

const updateLeadStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await leadsService.updateLeadStatus(id, status);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `Lead with ID ${id} not found`,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: updated,
      message: `Lead status updated to ${status}`,
    });
  } catch (error) {
    next(error);
  }
};

const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await leadsService.deleteLead(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `Lead with ID ${id} not found`,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: { id },
      message: "Lead deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeads,
  getLeadById,
  updateLeadStatus,
  deleteLead,
};
