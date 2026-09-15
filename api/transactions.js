const { sql, ensureSchema, VALID_STATUS, VALID_METHOD } = require('../lib/db');

module.exports = async (req, res) => {
  try {
    await ensureSchema();

    if (req.method === 'GET') {
      const { rows } = await sql`
        SELECT id, name, amount, status, method, txn_date
        FROM transactions
        ORDER BY txn_date DESC, id DESC
        LIMIT 500
      `;
      res.status(200).json(rows);
      return;
    }

    if (req.method === 'POST') {
      const token = req.headers['x-admin-token'];
      if (!token || token !== process.env.ADMIN_TOKEN) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const body = req.body || {};
      const name = typeof body.name === 'string' ? body.name.trim() : '';
      const amount = Number(body.amount);
      const status = body.status;
      const method = body.method;
      const date = body.date;

      if (!name || name.length > 120) {
        res.status(400).json({ error: 'Customer name is required (max 120 characters).' });
        return;
      }
      if (!Number.isFinite(amount) || amount <= 0 || amount > 10000000) {
        res.status(400).json({ error: 'Amount must be a positive number.' });
        return;
      }
      if (!VALID_STATUS.includes(status)) {
        res.status(400).json({ error: 'Invalid status.' });
        return;
      }
      if (!VALID_METHOD.includes(method)) {
        res.status(400).json({ error: 'Invalid payment method.' });
        return;
      }
      const parsedDate = new Date(date);
      if (!date || isNaN(parsedDate.getTime())) {
        res.status(400).json({ error: 'Invalid date.' });
        return;
      }
      const isoDate = parsedDate.toISOString().slice(0, 10);

      const { rows } = await sql`
        INSERT INTO transactions (name, amount, status, method, txn_date)
        VALUES (${name}, ${amount}, ${status}, ${method}, ${isoDate})
        RETURNING id, name, amount, status, method, txn_date
      `;
      res.status(201).json(rows[0]);
      return;
    }

    if (req.method === 'DELETE') {
      const token = req.headers['x-admin-token'];
      if (!token || token !== process.env.ADMIN_TOKEN) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const id = Number((req.query && req.query.id) || '');
      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ error: 'Invalid id.' });
        return;
      }
      await sql`DELETE FROM transactions WHERE id = ${id}`;
      res.status(200).json({ deleted: id });
      return;
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
