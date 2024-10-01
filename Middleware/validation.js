import { body } from 'express-validator';

export const bookingValidationRules = () => { 
    return [
        body('user_id').isInt().withMessage('รหัสผู้ใช้ต้องเป็นจำนวนเต็ม'),  
        body('room_id').isInt().withMessage('รหัสห้องต้องเป็นจำนวนเต็ม'),  
        body('booking_date').isISO8601().withMessage('วันที่จองต้องเป็นวันที่ที่ถูกต้อง'),  
        body('start_time').isString().withMessage('เวลาเริ่มต้องเป็นข้อความ'),  
        body('end_time').isString().withMessage('เวลาสิ้นสุดต้องเป็นข้อความ'),  
        body('purpose').optional().isString().withMessage('วัตถุประสงค์ต้องเป็นข้อความ')  
    ];
};

export const usersValidationRules = () => {
    return [
        body('username')
            .isString()
            .withMessage('ชื่อผู้ใช้ใช้ต้องเป็นข้อความและห้ามใช้อักขระพิเศษ')
            .notEmpty()
            .withMessage('กรุณากรอก Username'),

        body('firstname')
            .isString()
            .withMessage('ชื่อต้องเป็นข้อความและห้ามใช้อักขระพิเศษ')
            .notEmpty()
            .withMessage('กรุณากรอก First name'),

        body('lastname')
            .isString()
            .withMessage('นามสกุลต้องเป็นข้อความและห้ามใช้อักขระพิเศษ')
            .notEmpty()
            .withMessage('กรุณากรอก Last name '),

        body('email')
            .isEmail()
            .withMessage('อีเมลต้องเป็นที่อยู่อีเมลที่ถูกต้อง')
            .notEmpty()
            .withMessage('กรุณากรอก Email '),

        body('password')
            .isLength({ min: 6 })
            .withMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร')
            .notEmpty()
            .withMessage('กรุณากรอก Password is required'),

        body('department')
            .optional()
            .isString()
            .withMessage('แผนกต้องเป็นข้อความและห้ามใช้อักขระพิเศษ'),

        body('role')
            .optional()
            .isIn(['user', 'admin'])
            .withMessage('Role must be either user or admin'),

            body('phone_number')  
            .optional()  
            .isString()  
            .withMessage('หมายเลขโทรศัพท์ต้องเป็นตัวอักษร') 
            .isLength({ min: 10, max: 10 })  
            .withMessage('หมายเลขโทรศัพท์ต้องมีความยาว 10 หลัก')  
            .isNumeric()  
            .withMessage('หมายเลขโทรศัพท์ต้องประกอบด้วยตัวเลขเท่านั้น'),  
    ];
};

