import { Router } from "express";
import * as meetingroomBookingController from './meetingroomBooking.controller.js';
import isAdmin from '../Middleware/admin.js';
import { bookingValidationRules } from "../Middleware/validation.js";
const router = Router();

router.post('/postbooking', bookingValidationRules(),meetingroomBookingController.addBookingController);
router.get('/getbooking', meetingroomBookingController.getBookingsController);
router.put('/updatebooking/:booking_id', meetingroomBookingController.updateBookingController);
router.patch('/updatebookingstatus/:booking_id', isAdmin,meetingroomBookingController.updateBookingStatusController);
router.delete('/deletebooking/:booking_id', meetingroomBookingController.deleteBookingController);

//  สำหรับ Admin
router.get('/admin/pending-booking',isAdmin, meetingroomBookingController.getPendingBookings); 
router.patch('/admin/confrim-booking/:id',isAdmin, meetingroomBookingController.approveBooking); 
router.patch('/admin/cancel-booking/:id', isAdmin,meetingroomBookingController.rejectBooking); 

export default router; 