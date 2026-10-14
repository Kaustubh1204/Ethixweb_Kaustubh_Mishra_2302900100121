const db = require("../config/database");

class LeadsRepository {
  async create({ name, email, projectSubject, message }) {
    const text = `
      INSERT INTO leads (name, email, project_subject, message)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, project_subject, message, status, created_at, updated_at;
    `;
    const values = [name, email, projectSubject, message];
    const { rows } = await db.query(text, values);
    return rows[0];
  }

  async findAll({ status, search, limit = 50, offset = 0 }) {
    let text = `
      SELECT id, name, email, project_subject, message, status, created_at, updated_at
      FROM leads
      WHERE 1=1
    `;
    const values = [];

    if (status) {
      values.push(status);
      text += ` AND status = $${values.length}`;
    }

    if (search) {
      values.push(`%${search}%`);
      text += ` AND (name ILIKE $${values.length} OR email ILIKE $${values.length} OR project_subject ILIKE $${values.length} OR message ILIKE $${values.length})`;
    }

    values.push(limit);
    text += ` ORDER BY created_at DESC LIMIT $${values.length}`;

    values.push(offset);
    text += ` OFFSET $${values.length};`;

    const { rows } = await db.query(text, values);
    return rows;
  }

  async findById(id) {
    // Return null immediately if id is not a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id)) {
      return null;
    }

    const text = `
      SELECT id, name, email, project_subject, message, status, created_at, updated_at
      FROM leads
      WHERE id = $1;
    `;
    const { rows } = await db.query(text, [id]);
    return rows[0] || null;
  }

  async updateStatus(id, status) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id)) {
      return null;
    }

    const text = `
      UPDATE leads
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, name, email, project_subject, message, status, created_at, updated_at;
    `;
    const { rows } = await db.query(text, [status, id]);
    return rows[0] || null;
  }

  async delete(id) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id)) {
      return null;
    }

    const text = `
      DELETE FROM leads
      WHERE id = $1
      RETURNING id;
    `;
    const { rows } = await db.query(text, [id]);
    return rows[0] || null;
  }

  async getMetrics() {
    const text = `
      SELECT
        COUNT(*)::int AS total,
        COUNT(CASE WHEN status = 'new' THEN 1 END)::int AS new,
        COUNT(CASE WHEN status = 'contacted' THEN 1 END)::int AS contacted,
        COUNT(CASE WHEN status = 'qualified' THEN 1 END)::int AS qualified,
        COUNT(CASE WHEN status = 'closed' THEN 1 END)::int AS closed
      FROM leads;
    `;
    const { rows } = await db.query(text);
    return rows[0];
  }
}

module.exports = new LeadsRepository();
