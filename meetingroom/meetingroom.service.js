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

    async insertMeetingRoomDetail(detail) {
        const sql = `INSERT INTO meeting_room_details SET ?`;
        const [result] = await pool.query(sql, detail);
        return result;
    }
    
    async getMeetingRoomDetailsByRoomId(roomId) {
        const sql = `SELECT * FROM meeting_room_details WHERE room_id = ?`;
        const [result] = await pool.query(sql, [roomId]);
        return result;
    }

    async updateMeetingRoomDetail(detailId, detail) {
        const sql = `UPDATE meeting_room_details SET ? WHERE detail_id = ?`;
        const [result] = await pool.query(sql, [detail, detailId]);
        return result;
    }

    async getMeetingRoomDetailsByDetailId(roomId) {
        const sql = `SELECT * FROM meeting_room_details WHERE detail_id = ?`;
        const [result] = await pool.query(sql, [roomId]);
        return result;
    }
    
    async addDescription(room_id, description_text) {
        const sql = `INSERT INTO description (room_id, description_text) VALUES (?, ?)`;
        const [result] = await pool.query(sql, [room_id, description_text]);
        return result;
    }

    async updateDescriptionByRoom(room_id, updatedData) {
        const sql = `UPDATE description SET ? WHERE room_id = ?`;
        const [result] = await pool.query(sql, [updatedData, room_id]);
        return result;
    }
    
    
    async getDescriptionByRoomId(room_id) {
        const sql = `SELECT * FROM description WHERE room_id = ?`;
        const [result] = await pool.query(sql, [room_id]);
        return result[0];
    }

    async deleteDescriptionByRoom(room_id) {
        const sql = `DELETE FROM description WHERE room_id = ?`;
        const [result] = await pool.query(sql, [room_id]);
        return result;
    }
    
    async deleteMeetingRoomDetailsByRoomId(room_id){
        const sql = `DELETE FROM meeting_room_details WHERE room_id = ?`;
        const [result] = await pool.query(sql,[room_id]);
        return result;

    }

    async deleteMeetingRoomDetailsBydetailId(room_id){
        const sql = `DELETE FROM meeting_room_details WHERE detail_id = ?`;
        const [result] = await pool.query(sql,[room_id]);
        return result;

    }
    
}
