import { Router } from 'express';
import * as meetingRoomController from './meetingroom.controller.js';
import upload  from '../Middleware/upload.js'
import isAdmin from '../Middleware/admin.js';
import uploadMultiple from '../Middleware/uploaddetail.js';
import uploaddetail from '../Middleware/uploadupdatedetail.js';

const router = Router();

router.get('/getmeetingroom', meetingRoomController.getMeetingRoomsController);
router.get('/getmeetingroombyid/:room_id', meetingRoomController.getMeetingRoomByIdController);
router.post('/postmeetingroom', isAdmin,upload,meetingRoomController.addMeetingRoomController);
router.patch('/updatemeetingroom/:id', isAdmin,upload,meetingRoomController.updateMeetingRoomController);
router.delete('/deletemeetingroom/:id', isAdmin,meetingRoomController.deleteMeetingRoomController);
router.post('/postmeetingroomdetail/:room_id',isAdmin,uploadMultiple,meetingRoomController.addMeetingRoomDetailsController);
router.get('/getmeetingroomdetail/:room_id', meetingRoomController.getMeetingRoomDetailsByRoomIdController);
router.patch('/updatemeetingroomdetail/:detail_id', isAdmin,uploaddetail,meetingRoomController.updateMeetingRoomDetailsController);
router.get('/getdetail/:detail_id', meetingRoomController.getMeetingRoomDetailsByDetailIdController);

export default router;


