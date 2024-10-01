import { Router } from "express";
import users from "./users/user.routes.js";
import meetingroom from "./meetingroom/meetingroom.routes.js";
import meetingroomBooking from "./meetingroomBooking/meetingroomBooking.routes.js";
import news from "./newannouncements/new.routes.js";
import bookinghistory from "./bookinghistory/bookinghistory.routes.js";
const router = Router();

router.use("/users", users);
router.use("/meetingrooms", meetingroom);
router.use("/meetingroomBooking", meetingroomBooking);
router.use("/news", news);
router.use("/bookinghistory", bookinghistory);

export default router;