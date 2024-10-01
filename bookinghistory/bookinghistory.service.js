import { pool } from "../database.js";

export default class BookingHistoryService{

    async getBookingHistory() {
        const sql = 'SELECT * FROM booking_history';
        const [rows] = await pool.query(sql);
        return rows;
    }

}