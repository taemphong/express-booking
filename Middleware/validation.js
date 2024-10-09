import { body } from 'express-validator';
import { pool } from '../database.js';
import BookingService from '../meetingroomBooking/meetingroomBooking.service.js';

export const bookingValidationRules = () => {
    return [
        body('user_id').isInt().withMessage('รหัสผู้ใช้ต้องเป็นจำนวนเต็ม'),
        body('room_id').isInt().withMessage('รหัสห้องต้องเป็นจำนวนเต็ม'),
        body('booking_date').isISO8601().withMessage('วันที่จองต้องเป็นวันที่ที่ถูกต้อง'),
        body('start_time').isString().withMessage('เวลาเริ่มต้องเป็นข้อความ'),
        body('end_time').isString().withMessage('เวลาสิ้นสุดต้องเป็นข้อความ'),
        body('purpose').optional().isString().withMessage('วัตถุประสงค์ต้องเป็นข้อความ'),
        body('booking_date').custom(async (value, { req }) => {
            const bookingService = new BookingService();
            const { room_id, start_time, end_time } = req.body;

            // ตรวจสอบการจองที่มีอยู่
            const isRoomAvailable = await bookingService.checkRoomAvailability(
                room_id,
                value,
                start_time,
                end_time
            );

            if (!isRoomAvailable) {
                throw new Error('มีการจองห้องในวันและเวลาเดียวกันอยู่แล้ว');
            }
            return true;
        }),
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

export const usersupdateValidationRules = () => {
    return [
        body('username')
            .isString()
            .withMessage('ชื่อผู้ใช้ต้องเป็นข้อความและห้ามใช้อักขระพิเศษ')
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
            .withMessage('กรุณากรอก Last name'),

        body('email')
            .isEmail()
            .withMessage('อีเมลต้องเป็นที่อยู่อีเมลที่ถูกต้อง')
            .notEmpty()
            .withMessage('กรุณากรอก Email')
            .custom(async (value, { req }) => {
                const userId = req.params.id; // ส่ง userId ผ่านพารามิเตอร์ของ URL
                try {
                    console.log('ตรวจสอบอีเมล:', value, 'UserId:', userId);
                    
                    const [emailExists] = await pool.query(
                        'SELECT * FROM login WHERE email = ? AND user_id != ?',
                        [value, userId]
                    );
            
                    if (emailExists.length > 0) {
                        throw new Error('อีเมลนี้ถูกใช้งานแล้ว'); 
                    }
                    return true;
                } catch (error) {
                    console.error('Error during email check:', error); 
                    if (error.message === 'อีเมลนี้ถูกใช้งานแล้ว') {
                        throw new Error('อีเมลนี้ถูกใช้งานแล้ว'); 
                    } else {
                        throw new Error('เกิดข้อผิดพลาดในการตรวจสอบอีเมล');
                    }
                }
            }),

        body('department')
            .optional()
            .isString()
            .withMessage('แผนกต้องเป็นข้อความและห้ามใช้อักขระพิเศษ'),

        body('role')
            .optional()
            .isIn(['user', 'admin'])
            .withMessage('Role ต้องเป็น user หรือ admin'),

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

export const resetPasswordValidationRules = () => {
    return [
        body('confirmationCode')
            .notEmpty()
            .withMessage('กรุณากรอกรหัสยืนยัน'),

        body('id')
            .isInt()
            .withMessage('ID ผู้ใช้ต้องเป็นจำนวนเต็ม'),

        body('newPassword')
            .isLength({ min: 6 })
            .withMessage('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร')
            .notEmpty()
            .withMessage('กรุณากรอกรหัสผ่านใหม่'),
    ];
};