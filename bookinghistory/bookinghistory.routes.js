import { Router } from "express";
import * as bookinghistoryController from "./bookinghistory.controller.js";

const router = Router();

router.get('/gethistory', bookinghistoryController.getBookingHistoryController);

export default router;