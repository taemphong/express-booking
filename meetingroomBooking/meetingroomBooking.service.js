import { pool } from '../database.js';

//สร้างการจอง
export default class BookingService {

    // ตรวจสอบว่าห้องว่างหรือไม่
    async checkRoomAvailability(room_id, booking_date, start_time, end_time) {
        const sql = `SELECT * FROM meeting_room_booking 
                    WHERE room_id = ? 
                    AND booking_date = ? 
                    AND (
                        (start_time < ? AND end_time > ?) OR  
                        (start_time >= ? AND start_time < ?) OR  
                        (end_time > ? AND end_time <= ?)  
                    )`;

        const [rows] = await pool.query(sql, [
            room_id, 
            booking_date, 
            start_time, 
            end_time, 
            start_time, 
            end_time, 
            start_time, 
            end_time
        ]);

        return rows.length === 0; 
    }

    // เพิ่มการจอง
    async insertBooking(bookingData) {
        const sql = 'INSERT INTO meeting_room_booking SET ?';
        const [result] = await pool.query(sql, bookingData);
        return result;
    }

    // ดึงรายการจองทั้งหมด
    async getAllBookings() {
        const sql = 'SELECT * FROM meeting_room_booking';
        const [rows] = await pool.query(sql);
        return rows;
    }

    // ดึงด้วย id
    async getBookingById(booking_id) {
        const sql = 'SELECT * FROM meeting_room_booking WHERE booking_id = ?';
        const [rows] = await pool.query(sql, [booking_id]);
        return rows[0]; 
    }

    // อัปเดตการจอง
    async updateBooking(booking_id, updateData) {
        const sql = 'UPDATE meeting_room_booking SET ? WHERE booking_id = ?';
        try {
            const [result] = await pool.query(sql, [updateData, booking_id]);
            return result;
        } catch (error) {
            throw new Error('Error updating booking: ' + error.message);
        }
    }

    // ลบการจอง
    async deleteBooking(booking_id) {
        const sql = 'DELETE FROM  meeting_room_booking WHERE booking_id = ?'; 
        try {
            const [result] = await pool.query(sql, [booking_id]); 
            return result;
        } catch (error) {
            throw new EvalError('Error deleting booking: ' + error.message);
        }
    }

    // **อัปเดตใหม่**: ดึงรายการจองที่สถานะเป็น "pending"
    async getPendingBookings() {
        const sql = 'SELECT * FROM meeting_room_booking WHERE status = "pending"';
        const [rows] = await pool.query(sql);
        return rows;
    }

    // **อัปเดตใหม่**: อัปเดตสถานะการจอง
    async updateBookingStatus(booking_id, status) {
        const sql = 'UPDATE meeting_room_booking SET status = ? WHERE booking_id = ?';
        try {
            const [result] = await pool.query(sql, [status, booking_id]);
            return result;
        } catch (error) {
            throw new Error('Error updating booking status: ' + error.message);
        }
    }

    //บันทึกการจอง
    async insertBookingHistory(historyData) {
        const sql = 'INSERT INTO booking_history SET ?';
        const [result] = await pool.query(sql, historyData);
        return result;
    }
    
    async getBookingHistory() {
        const sql = 'SELECT * FROM booking_history';
        const [rows] = await pool.query(sql);
        return rows;
    }
}
