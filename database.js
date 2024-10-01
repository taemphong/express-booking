import mysql from 'mysql2';
import config from './config.js';

export const pool = mysql.createPool(config.db.main).promise();

async function checkDatabaseConnection() {
    try {
      
      const [rows, fields] = await pool.query('SELECT 1');
      console.log('Database connection successful!');
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  }
  
  checkDatabaseConnection();