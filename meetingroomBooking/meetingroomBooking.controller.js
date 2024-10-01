import BookingService from './meetingroomBooking.service.js';
import { sendBookingNotification } from '../notification/notification.service.js';
import { validationResult } from 'express-validator';

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

//อัปเดตข้อมูล
export const updateBookingController = async (req, res) => {
    const { booking_id } = req.params;
    const updateData = req.body;

    try {
        const bookingService = new BookingService();
        const result = await bookingService.updateBooking(booking_id, updateData);
        if (result.affectedRows) {
            res.status(200).send({
                status: "success",
                code: 1,
                message: "Booking updated successfully",
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

//อัปเดตสถานะ
export const updateBookingStatusController = async (req, res) => {
    const { booking_id } = req.params;
    const { status } = req.body;

    try {
        const bookingService = new BookingService();
        const result = await bookingService.updateBookingStatus(booking_id, status);
        if (result.affectedRows) {
            res.status(200).send({
                status: "success",
                code: 1,
                message: "Booking status updated successfully",
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
    try {
        const result = await bookingService.updateBookingStatus(bookingId, 'confrim');
        if (result.affectedRows > 0) {
            res.status(200).json({ 
                status: 'success', 
                message: 'Booking approved' 
            });
        } else {
            res.status(400).json({ 
                status: 'fail', 
                message: 'Booking not found' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            status: 'fail', 
            message: error.message 
        });
    }
};

// ปฏิเสธการจองอัปเดตสถานะ
export const rejectBooking = async (req, res) => {
    const bookingId = req.params.id;
    const bookingService = new BookingService();  
    try {
        const result = await bookingService.updateBookingStatus(bookingId, 'cancel');
        if (result.affectedRows > 0) {
            res.status(200).json({ 
                status: 'success', 
                message: 'Booking rejected' 
            });
        } else {
            res.status(400).json({ 
                status: 'fail', 
                message: 'Booking not found' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            status: 'fail', 
            message: error.message 
        });
    }
};