import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const isAdmin = (req, res, next) => {

    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'ไม่มีโทเคนที่ให้มา' });
    }


    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'การเข้าถึงที่ไม่ได้รับอนุญาต' });
        }

     
        if (decoded.role === 'admin') {
            req.user = decoded; 
            next(); 
        } else {
            res.status(403).json({ message: 'ต้องการสิทธิ์ผู้ดูแลระบบ' });
        }
    });
};

export default isAdmin;

//header สำหรับเรียกใช้ token 
/*headers: {
    'Authorization': `Bearer ${token}`, // เพิ่ม token ใน header
},*/