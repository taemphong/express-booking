import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const isAdmin = (req, res, next) => {
    // รับ token จาก header
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    // ตรวจสอบ token ด้วย JWT
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        // เช็คว่า user role เป็น admin หรือไม่
        if (decoded.role === 'admin') {
            req.user = decoded; // เพิ่มข้อมูลผู้ใช้ใน request
            next(); // อนุญาตให้ดำเนินการต่อ
        } else {
            res.status(403).json({ message: 'Require admin role' });
        }
    });
};

export default isAdmin;

//header สำหรับเรียกใช้ token 
/*headers: {
    'Authorization': `Bearer ${token}`, // เพิ่ม token ใน header
},*/