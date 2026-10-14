const leadsRepository = require("../repositories/leads.repository");

class LeadsService {
  async submitLead(data) {
    const lead = await leadsRepository.create(data);
    return {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      projectSubject: lead.project_subject,
      project_subject: lead.project_subject,
      status: lead.status,
      createdAt: lead.created_at,
      created_at: lead.created_at,
      updatedAt: lead.updated_at,
      updated_at: lead.updated_at,
    };
  }

  async getLeads(filters) {
    const leads = await leadsRepository.findAll(filters);
    return leads.map((l) => ({
      id: l.id,
      name: l.name,
      email: l.email,
      projectSubject: l.project_subject,
      project_subject: l.project_subject,
      message: l.message,
      status: l.status,
      createdAt: l.created_at,
      created_at: l.created_at,
      updatedAt: l.updated_at,
      updated_at: l.updated_at,
    }));
  }

  async getLeadById(id) {
    const lead = await leadsRepository.findById(id);
    if (!lead) return null;
    return {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      projectSubject: lead.project_subject,
      project_subject: lead.project_subject,
      message: lead.message,
      status: lead.status,
      createdAt: lead.created_at,
      created_at: lead.created_at,
      updatedAt: lead.updated_at,
      updated_at: lead.updated_at,
    };
  }

  async updateLeadStatus(id, status) {
    const lead = await leadsRepository.updateStatus(id, status);
    if (!lead) return null;
    return {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      projectSubject: lead.project_subject,
      project_subject: lead.project_subject,
      message: lead.message,
      status: lead.status,
      createdAt: lead.created_at,
      created_at: lead.created_at,
      updatedAt: lead.updated_at,
      updated_at: lead.updated_at,
    };
  }

  async deleteLead(id) {
    return await leadsRepository.delete(id);
  }

  async getMetrics() {
    return await leadsRepository.getMetrics();
  }
}

module.exports = new LeadsService();
