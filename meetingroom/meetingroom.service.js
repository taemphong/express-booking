import { pool } from '../database.js';

export default class MeetingRoomService {

    async getMeetingRooms() {
        let sql = `SELECT * FROM meeting_room`;
        const [result] = await pool.query(sql);
        return result;
    }

    async getMeetingRoomById(roomId) {
        const sql = `SELECT * FROM meeting_room WHERE room_id = ?`;
        const [result] = await pool.query(sql, [roomId]); 
        return result[0]; 
    }
    

    async insertMeetingRoom(meetingRoom) {
        let sql = `INSERT INTO meeting_room SET ?`;
        const [result] = await pool.query(sql, meetingRoom);
        return result;
    }

    async updateMeetingRoom(roomId, updatedData) {
        let sql = `UPDATE meeting_room SET ? WHERE room_id = ?`;
        const [result] = await pool.query(sql, [updatedData, roomId]);
        return result;
    }

    async deleteMeetingRoom(roomId) {
        const sql = `DELETE FROM meeting_room WHERE room_id = ?`;
        const [result] = await pool.query(sql, [roomId]);
        return result;
    }

    
}
