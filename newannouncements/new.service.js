import { pool } from '../database.js';

export default class NewsService {
    
    async createNews(newsData) {
        const sql = 'INSERT INTO news_announcements SET ?';
        try {
            const [result] = await pool.query(sql, newsData);
            return result;
        } catch (error) {
            throw new Error('Error creating news: ' + error.message);
        }
    }

    async updateNews(news_id,newsData) {
        const sql = 'UPDATE news_announcements SET ? WHERE news_id = ?';
        try {
            const [result] = await pool.query(sql, [newsData, news_id]);
            return result;
        } catch (error) {
            throw new Error('Error creating news: ' + error.message);
        }
    }

    async deleteNews(news_id) {
        const sql = 'DELETE FROM news_announcements WHERE news_id = ?';
        try {
            const [result] = await pool.query(sql, [news_id]);
            return result;
        } catch (error) {
            throw new Error('Error deleting news: ' + error.message);
        }
    }

    async getNewsById(news_id) {
        const sql = 'SELECT * FROM news_announcements WHERE news_id = ?';
        try {
            const [rows] = await pool.query(sql, [news_id]);
            return rows[0]; // คืนค่าข้อมูลข่าวสารที่ตรงกัน
        } catch (error) {
            throw new Error('Error fetching news by ID: ' + error.message);
        }
    }

}
