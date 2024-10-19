import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5, 
    message: {
        message: 'มีการพยายามเข้าสู่ระบบมากเกินไป กรุณาลองใหม่ภายหลัง.',
    },
});

export default loginLimiter; 
