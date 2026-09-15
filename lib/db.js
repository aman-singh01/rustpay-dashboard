const { sql } = require('@vercel/postgres');

const VALID_STATUS = ['Successful', 'Failed', 'Pending', 'Refunded'];
const VALID_METHOD = ['cards', 'bank', 'wallets', 'cash'];

async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      amount NUMERIC(12,2) NOT NULL,
      status TEXT NOT NULL,
      method TEXT NOT NULL,
      txn_date DATE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}

module.exports = { sql, ensureSchema, VALID_STATUS, VALID_METHOD };
