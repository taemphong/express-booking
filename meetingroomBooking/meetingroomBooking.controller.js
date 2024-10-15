import BookingService from './meetingroomBooking.service.js';
import { sendBookingNotification } from '../notification/notification.service.js';
import { validationResult } from 'express-validator';
import UserService from '../users/user.service.js';
import MeetingRoomService from '../meetingroom/meetingroom.service.js';
import nodemailer from 'nodemailer';

//จองห้องตรวจสอบว่าห้องว่างมั้ยจะมีการส่งเมลให้กับ admin เมื่อมีการจองห้องและเก็บข้อมูลประวัติการจอง
export const addBookingController = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "fail",
            code: 0,
            message: "Validation errors",
            errors: errors.array(),
        });
    }

    const bookingData = {
        user_id: req.body.user_id,
        room_id: req.body.room_id,
        booking_date: req.body.booking_date,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        purpose: req.body.purpose || null, 
        status: 'pending', 
    };

    try {
        const bookingService = new BookingService();
        
        // ตรวจสอบว่าห้องว่างหรือไม่
        const isRoomAvailable = await bookingService.checkRoomAvailability(
            bookingData.room_id, 
            bookingData.booking_date, 
            bookingData.start_time, 
            bookingData.end_time
        );
        
        if (!isRoomAvailable) {
            return res.status(400).send({
                status: "fail",
                code: 0,
                message: "Room is not available for the selected time",
                result: "",
            });
        }

        // ถ้าห้องว่าง ให้ทำการจอง
        const result = await bookingService.insertBooking(bookingData);
        if (result.insertId) {
            const historyData = {
                booking_id: result.insertId,
                action: 'created',
                performed_by: bookingData.user_id,
            };
            await bookingService.insertBookingHistory(historyData);
             // ส่งการแจ้งเตือนไปยังผู้ดูแล
            await sendBookingNotification(bookingData);
            res.status(201).send({
                status: "success",
                code: 1,
                message: "Booking added successfully",
                result,
            });
        } else {
            res.status(400).send({
                status: "fail",
                code: 0,
                message: "Booking could not be added",
                result: "",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "fail",
            code: 0,
            message: error.message,
            result: "",
        });
    }
};

//เรียกดูข้อมูลการจอง
export const getBookingsController = async (req, res) => {
    try {
        const bookings = await new BookingService().getAllBookings();
        res.status(200).send({
            status: "success",
            code: 1,
            message: "Bookings fetched successfully",
            result: bookings,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "fail",
            code: 0,
            message: error.message,
            result: "",
        });
    }
};

// ดึงรายการจองของuser
export const getUserBookingsController = async (req, res) => {
    const { user_id } = req.params;

    try {
        const bookings = await new BookingService().getBookingsByUserId(user_id);
        
        if (bookings.length > 0) {
            res.status(200).send({
                status: "success",
                code: 1,
                message: "User bookings fetched successfully",
                result: bookings,
            });
        } else {
            res.status(404).send({
                status: "fail",
                code: 0,
                message: "No bookings found for this user",
                result: "",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "fail",
            code: 0,
            message: error.message,
            result: "",
        });
    }
};

//ดึงวันเวลาที่confirmแล้วมาแสดงในปฏิทิน
export const getConfirmedBookingsController = async (req, res) => {
    try {
        const confirmedBookings = await new BookingService().getConfirmedBookings();
        res.status(200).send({
            status: "success",
            code: 1,
            message: "ดึงข้อมูลการจองที่ได้รับการยืนยันเรียบร้อยแล้ว",
            result: confirmedBookings,
        });
    } catch (error) {
        res.status(500).send({
            status: "fail",
            code: 0,
            message: error.message,
        });
    }
};

//แก้ไขข้อมูล
export const editBookingController = async (req, res) => {
    const { booking_id } = req.params;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "fail",
            code: 0,
            message: "Validation errors",
            errors: errors.array(),
        });
    }

    const updatedData = {
        room_id: req.body.room_id,
        booking_date: req.body.booking_date,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        purpose: req.body.purpose || null,
    };

    try {
        const bookingService = new BookingService();

        // ตรวจสอบสถานะการจองก่อนแก้ไข
        const booking = await bookingService.getBookingById(booking_id);
        if (!booking) {
            return res.status(404).json({
                status: "fail",
                code: 0,
                message: "Booking not found",
            });
        }

        // ห้ามแก้ไขหากสถานะการจองได้รับการอนุมัติแล้ว
        if (booking.status === 'confrim') {
            return res.status(400).json({
                status: "fail",
                code: 0,
                message: "Cannot edit booking. It has already been confirmed.",
            });
        }

        // ตรวจสอบว่าห้องว่างในช่วงเวลาที่แก้ไขใหม่หรือไม่
        const isRoomAvailable = await bookingService.checkRoomAvailability(
            updatedData.room_id, 
            updatedData.booking_date, 
            updatedData.start_time, 
            updatedData.end_time
        );

        if (!isRoomAvailable) {
            return res.status(400).json({
                status: "fail",
                code: 0,
                message: "Room is not available for the selected time.",
            });
        }

        // ถ้าห้องว่าง ให้ทำการอัปเดตข้อมูลการจอง
        const result = await bookingService.updateBooking(booking_id, updatedData);

        if (result.affectedRows > 0) {
            res.status(200).json({
                status: "success",
                code: 1,
                message: "Booking updated successfully",
                result,
            });
        } else {
            res.status(400).json({
                status: "fail",
                code: 0,
                message: "Booking could not be updated",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "fail",
            code: 0,
            message: error.message,
        });
    }
};


//ลบการจอง
export const deleteBookingController = async (req, res) => {
    const { booking_id } = req.params;

    try {
        const bookingService = new BookingService();
        const result = await bookingService.deleteBooking(booking_id);
        
        if (result.affectedRows > 0) {
            res.status(200).send({
                status: "success",
                code: 1,
                message: "Booking deleted successfully",
                result,
            });
        } else {
            res.status(404).send({
                status: "fail",
                code: 0,
                message: "Booking not found",
                result: "",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "fail",
            code: 0,
            message: error.message,
            result: "",
        });
    }
};

//ฝั่ง Admin
// ดึงรายการจองที่สถานะเป็น pending เพื่อรอการยืนยัน
export const getPendingBookings = async (req, res) => {
    const bookingService = new BookingService();  
    try {
        const pendingBookings = await bookingService.getPendingBookings();
        res.status(200).json({ 
            status: 'success', 
            bookings: pendingBookings 
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'fail', 
            message: error.message 
        });
    }
};

// อนุมัติการจองอัปเดตสถานะ
export const approveBooking = async (req, res) => {
    const bookingId = req.params.id;
    const bookingService = new BookingService();
    const userService = new UserService();
    const meetingRoomService = new MeetingRoomService(); // สร้าง MeetingRoomService

    try {
        // อัปเดตสถานะการจองเป็น 'confirm'
        const result = await bookingService.updateBookingStatus(bookingId, 'confirm');
        if (result.affectedRows > 0) {
            // ดึงข้อมูลการจอง
            const booking = await bookingService.getBookingById(bookingId);
            if (!booking || !booking.user_id || !booking.room_id) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'ไม่พบการจองนี้หรือไม่พบผู้ใช้หรือห้องประชุม',
                });
            }

            // ดึงข้อมูลผู้ใช้จาก user_id
            const user = await userService.getUserById(booking.user_id);
            if (!user || !user.email) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'ไม่พบผู้ใช้หรือไม่พบอีเมลของผู้ใช้',
                });
            }

            // ดึงข้อมูลห้องประชุมจาก room_id
            const meetingRoom = await meetingRoomService.getMeetingRoomById(booking.room_id);
            if (!meetingRoom || !meetingRoom.room_name) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'ไม่พบห้องประชุมหรือชื่อห้องประชุม',
                });
            }

            // การตั้งค่า Nodemailer
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const emailHtml = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: black;">
                <p>เรียนคุณ <strong>${user.firstname}</strong>,</p>

                <p>เรามีความยินดีที่จะแจ้งให้ท่านทราบว่า การจองห้องประชุม <strong>"${meetingRoom.room_name}"</strong> ของท่านได้รับการอนุมัติเรียบร้อยแล้ว</p>
                
                <p>รายละเอียดการจอง:</p>
                <ul style="list-style-type: none; padding: 0;">
                    <li style="margin-bottom: 5px;">- <strong>เวลา:</strong> ${booking.start_time} ถึง ${booking.end_time}</li>
                    <li style="margin-bottom: 5px;">- <strong>หมายเลขการจอง:</strong> ${bookingId}</li>
                </ul>
                
                <p>หากท่านมีคำถามเพิ่มเติมหรือต้องการเปลี่ยนแปลงการจอง กรุณาติดต่อเจ้าหน้าที่ที่เกี่ยวข้อง</p>
                
                <p style="margin-top: 20px;">ขอแสดงความนับถือ,</p>
                <p>ทีมงานฝ่ายจองห้องประชุม</p>
            </div>
        `;

        // การส่งอีเมล
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'การจองห้องได้รับการอนุมัติ',
            html: emailHtml,
        };


            // ส่งอีเมล
            await transporter.sendMail(mailOptions);

            // ตอบกลับ
            res.status(200).json({
                status: 'success',
                message: 'การจองได้รับการอนุมัติและแจ้งเตือนผู้ใช้เรียบร้อยแล้ว',
            });
        } else {
            res.status(400).json({
                status: 'fail',
                message: 'ไม่พบการจองนี้',
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message,
        });
    }
};


// ปฏิเสธการจองอัปเดตสถานะ
export const rejectBooking = async (req, res) => {
    const bookingId = req.params.id;
    const bookingService = new BookingService();
    const userService = new UserService();
    const meetingRoomService = new MeetingRoomService(); // สร้าง MeetingRoomService

    try {
        const result = await bookingService.updateBookingStatus(bookingId, 'cancel');
        if (result.affectedRows > 0) {
            // ดึงข้อมูลการจอง
            const booking = await bookingService.getBookingById(bookingId);
            if (!booking || !booking.user_id || !booking.room_id) { // ตรวจสอบ booking, user_id, room_id ไม่ใช่ค่า null
                return res.status(404).json({
                    status: 'fail',
                    message: 'ไม่พบการจองนี้หรือไม่พบผู้ใช้หรือห้องประชุม',
                });
            }

            // ดึงข้อมูลผู้ใช้จาก user_id
            const user = await userService.getUserById(booking.user_id);
            if (!user || !user.email) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'ไม่พบผู้ใช้หรือไม่พบอีเมลของผู้ใช้',
                });
            }

            // ดึงข้อมูลห้องประชุมจาก room_id
            const meetingRoom = await meetingRoomService.getMeetingRoomById(booking.room_id);
            if (!meetingRoom || !meetingRoom.room_name) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'ไม่พบห้องประชุมหรือชื่อห้องประชุม',
                });
            }

            // การตั้งค่า Nodemailer
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const emailHtmlcancel = ` <div style="font-family: Arial, sans-serif; line-height: 1.6; color: black;">
            <p>เรียนคุณ <strong>${user.firstname}</strong>,</p>

            <p>เรามีความเสียใจที่จะแจ้งให้ท่านทราบว่า การจองห้องประชุม <strong>"${meetingRoom.room_name}"</strong> ของท่านได้ถูกปฏิเสธ</p>
            
            <p>รายละเอียดการจอง:</p>
            <ul style="list-style-type: none; padding: 0;">
                <li style="margin-bottom: 5px;">- <strong>เวลา:</strong> ${booking.start_time} ถึง ${booking.end_time}</li>
                <li style="margin-bottom: 5px;">- <strong>หมายเลขการจอง:</strong> ${bookingId}</li>
            </ul>
            
            <p>หากท่านมีคำถามเพิ่มเติมหรือต้องการเปลี่ยนแปลงการจอง กรุณาติดต่อเจ้าหน้าที่ที่เกี่ยวข้อง</p>
            
            <p style="margin-top: 20px;">ขอแสดงความนับถือ,</p>
            <p>ทีมงานฝ่ายจองห้องประชุม</p>
            </div> `

            // เนื้อหาอีเมล
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'การจองห้องถูกปฏิเสธ',
                text: emailHtmlcancel,
            };

            // ส่งอีเมล
            await transporter.sendMail(mailOptions);

            // ตอบกลับ
            res.status(200).json({
                status: 'success',
                message: 'Booking rejected and user notified',
            });
        } else {
            res.status(400).json({
                status: 'fail',
                message: 'Booking not found',
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message,
        });
    }
};