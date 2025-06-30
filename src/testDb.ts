import pool from './config/db';

const testDb = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ DB Connected at:', result.rows[0].now);
  } catch (err) {
    console.error('❌ DB Connection failed:', err);
  }
};

testDb();
