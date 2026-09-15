const { sql, ensureSchema } = require('../lib/db');

const SEED = [
  { name: 'Olivia Carter', amount: 1250.00, status: 'Successful', method: 'cards', date: '2025-05-28' },
  { name: 'Liam Smith', amount: 320.00, status: 'Failed', method: 'bank', date: '2025-05-28' },
  { name: 'Emma Johnson', amount: 980.00, status: 'Successful', method: 'wallets', date: '2025-05-27' },
  { name: 'Noah Brown', amount: 640.00, status: 'Pending', method: 'cash', date: '2025-05-26' },
  { name: 'Ava Davis', amount: 415.00, status: 'Successful', method: 'cards', date: '2025-05-25' },
  { name: 'James Wilson', amount: 210.00, status: 'Successful', method: 'bank', date: '2025-05-24' },
  { name: 'Sophia Martinez', amount: 75.50, status: 'Successful', method: 'cards', date: '2025-05-24' },
  { name: 'Lucas Anderson', amount: 1840.00, status: 'Successful', method: 'wallets', date: '2025-05-23' },
  { name: 'Mia Thompson', amount: 132.20, status: 'Failed', method: 'cards', date: '2025-05-23' },
  { name: 'Ethan Walker', amount: 560.00, status: 'Successful', method: 'cash', date: '2025-05-22' },
  { name: 'Isabella Clark', amount: 990.00, status: 'Pending', method: 'bank', date: '2025-05-22' },
  { name: 'Benjamin Lewis', amount: 45.00, status: 'Successful', method: 'wallets', date: '2025-05-21' },
  { name: 'Charlotte Hall', amount: 2310.00, status: 'Successful', method: 'cards', date: '2025-05-21' },
  { name: 'Henry Young', amount: 310.75, status: 'Failed', method: 'bank', date: '2025-05-20' },
  { name: 'Amelia King', amount: 685.00, status: 'Successful', method: 'wallets', date: '2025-05-20' },
  { name: 'Jack Wright', amount: 128.40, status: 'Successful', method: 'cards', date: '2025-05-19' },
  { name: 'Grace Scott', amount: 950.00, status: 'Pending', method: 'cash', date: '2025-05-19' },
  { name: 'Daniel Green', amount: 275.00, status: 'Successful', method: 'bank', date: '2025-05-18' },
  { name: 'Chloe Baker', amount: 1120.00, status: 'Successful', method: 'cards', date: '2025-05-18' },
  { name: 'Samuel Adams', amount: 60.00, status: 'Failed', method: 'wallets', date: '2025-05-17' },
  { name: 'Grace Lin', amount: 90.00, status: 'Refunded', method: 'cards', date: '2025-05-17' }
];

module.exports = async (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    await ensureSchema();
    const { rows } = await sql`SELECT COUNT(*)::int AS c FROM transactions`;
    if (rows[0].c > 0) {
      res.status(200).json({ message: 'Already seeded', count: rows[0].c });
      return;
    }
    for (const t of SEED) {
      await sql`
        INSERT INTO transactions (name, amount, status, method, txn_date)
        VALUES (${t.name}, ${t.amount}, ${t.status}, ${t.method}, ${t.date})
      `;
    }
    res.status(200).json({ message: 'Seeded', count: SEED.length });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
