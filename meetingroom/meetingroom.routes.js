import { Router } from 'express';
import * as meetingRoomController from './meetingroom.controller.js';
import upload  from '../Middleware/upload.js'
import isAdmin from '../Middleware/admin.js';

const router = Router();

router.get('/getmeetingroom', meetingRoomController.getMeetingRoomsController);
router.get('/getmeetingroombyid', meetingRoomController.getMeetingRoomByIdController);
router.post('/postmeetingroom', isAdmin,upload,meetingRoomController.addMeetingRoomController);
router.patch('/updatemeetingroom/:id', isAdmin,upload,meetingRoomController.updateMeetingRoomController);
router.delete('/deletemeetingroom/:id', isAdmin,meetingRoomController.deleteMeetingRoomController);

export default router;


