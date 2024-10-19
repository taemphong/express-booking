import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 นาที
    max: 5,
    handler: (req, res) => {
        const resetTime = new Date(req.rateLimit.resetTime); // เวลาที่จะรีเซ็ต
        const timeRemaining = resetTime - Date.now(); // เวลาที่เหลือ (มิลลิวินาที)
        
        // แปลงมิลลิวินาทีเป็นนาทีและวินาที
        const minutes = Math.floor((timeRemaining / 1000) / 60);
        const seconds = Math.floor((timeRemaining / 1000) % 60);
        
        return res.status(429).json({
            message: 'มีการพยายามเข้าสู่ระบบมากเกินไป กรุณาลองใหม่ภายหลัง.',
            timeRemaining: {
                minutes: minutes, 
                seconds: seconds 
            }
        });
    }
});

export default loginLimiter;
