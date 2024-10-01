import { pool } from '../database.js';

export default class UserService {
    async getUsers() {
        let sql = `SELECT * FROM login`;
        const [result] = await pool.query(sql);
        return result;
}

async getUserById(id) {
    const sql = 'SELECT * FROM login WHERE user_id = ?'; 
    try {
        const [rows] = await pool.query(sql, [id]);
        return rows[0]; 
    } catch (error) {
        throw new Error('Error fetching user: ' + error.message);
    }
}
async insertUser(user) {
    let sql = `INSERT INTO login SET ?`;
    const [result] = await pool.query(sql, user);
    return result;
}

async loginuser(username,password_hash){
    let sql = `SELECT * FROM login WHERE username = '${username}' AND password_hash = '${password_hash}'`;
    const [result] = await pool.query(sql);
    return result;
}

async checkUserExists(username) {
    let sql = `SELECT * FROM login WHERE username = '${username}'`;
    const [result] = await pool.query(sql);
    return result.length > 0; 
}

async deleteUser(id) {
    const deleteBookingsSQL = 'DELETE FROM meeting_room_booking WHERE user_id = ?';
    const deleteUserSQL = 'DELETE FROM login WHERE user_id = ?';
    
    const connection = await pool.getConnection(); 
    try {
        await connection.beginTransaction(); 

       
        await connection.query(deleteBookingsSQL, [id]);

        
        const [result] = await connection.query(deleteUserSQL, [id]);

        await connection.commit(); 
        return result;
    } catch (error) {
        await connection.rollback(); 
        throw new Error('Error deleting user and related bookings: ' + error.message);
    } finally {
        connection.release(); 
    }
}

async updateUser(id, updatedData) {
    const sql = 'UPDATE login SET ? WHERE user_id = ?';
    try {
        const [result] = await pool.query(sql, [updatedData, id]);
        return result;
    } catch (error) {
        throw new Error('Error updating user: ' + error.message);
    }
}

}

