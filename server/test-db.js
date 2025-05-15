const db = require('./db');

async function testConnection() {
  try {
    const [rows] = await db.execute('SELECT 1 + 1 AS result');
    console.log('DB connection OK:', rows);
  } catch (err) {
    console.error('DB connection error:', err);
  }
}

testConnection();
