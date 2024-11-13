import { Router } from "express";
import * as meetingroomBookingController from './meetingroomBooking.controller.js';
import isAdmin from '../Middleware/admin.js';
import { bookingValidationRules } from "../Middleware/validation.js";
const router = Router();

router.post('/postbooking', bookingValidationRules(),meetingroomBookingController.addBookingController);
router.get('/getbooking',meetingroomBookingController.getBookingsController);
router.delete('/deletebooking/:booking_id', meetingroomBookingController.deleteBookingController);
router.get('/getuserbooking/:user_id', meetingroomBookingController.getUserBookingsController);
router.get('/get-confirmed-booking', meetingroomBookingController.getConfirmedBookingsController);
router.get('/getpendingByroomID/:room_id', meetingroomBookingController.getPendingBookingsByRoomIdController);

//  สำหรับ Admin
router.get('/admin/pending-booking',isAdmin, meetingroomBookingController.getPendingBookings); 
router.patch('/admin/confrim-booking/:id',isAdmin, meetingroomBookingController.approveBooking); 
router.patch('/admin/cancel-booking/:id', isAdmin,meetingroomBookingController.rejectBooking); 
export default router; 