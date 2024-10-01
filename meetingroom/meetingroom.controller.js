import MeetingRoomService from './meetingroom.service.js';

const meetingRoomService = new MeetingRoomService();

//adminดูข้อมูลห้อง
export const getMeetingRoomsController = async (req, res) => {
    try {
        const rooms = await meetingRoomService.getMeetingRooms();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMeetingRoomByIdController = async (req, res) => {
    const roomId = req.params.room_id; 

    try {
        const room = await meetingRoomService.getMeetingRoomById(roomId);
        
        if (!room) {
            return res.status(404).json({
                status: "fail",
                code: 0,
                message: "Meeting room not found",
                result: "",
            });
        }

        res.status(200).json({
            status: "success",
            code: 1,
            message: "Meeting room details retrieved successfully",
            result: room,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//adminสร้างห้องประชุม
export const addMeetingRoomController = async (req, res) => {
    const meetingRoom = {
        room_name: req.body.room_name,
        capacity: req.body.capacity,
        location: req.body.location,
        amenities: req.body.amenities || null, 
        is_available: req.body.is_available || true, 
        room_image: req.file.path || null
    };

    try {
        const result = await new MeetingRoomService().insertMeetingRoom(meetingRoom);
        console.log(meetingRoom);

        if (result.insertId) {
            res.status(201).send({
                status: "success",
                code: 1,
                message: "Meeting room added successfully",
                cause: "",
                result,
            });
        } else {
            res.status(400).send({
                status: "fail",
                code: 0,
                message: "Meeting room could not be added",
                cause: "",
                result: "",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "fail",
            code: 0,
            message: error.message,
            cause: "",
            result: "",
        });
    }
};

//adminอัปเดตห้อง
export const updateMeetingRoomController = async (req, res) => {
    const roomId = req.params.id; 

    const existingRoom = await meetingRoomService.getMeetingRoomById(roomId);

    const updatedData = {
        room_name: req.body.room_name,
        capacity: req.body.capacity,
        location: req.body.location,
        amenities: req.body.amenities || null, 
        is_available: req.body.is_available || true, 
        room_image: req.file ? req.file.path : existingRoom.room_image 
    };

    try {
        const result = await meetingRoomService.updateMeetingRoom(roomId, updatedData);
        if (result.affectedRows > 0) {
            res.status(200).send({
                status: "success",
                code: 1,
                message: "Meeting room updated successfully",
                cause: "",
                result,
            });
        } else {
            res.status(404).send({
                status: "fail",
                code: 0,
                message: "Meeting room not found",
                cause: "",
                result: "",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "fail",
            code: 0,
            message: error.message,
            cause: "",
            result: "",
        });
    }
};


//adminลบห้อง
export const deleteMeetingRoomController = async (req, res) => {
    const roomId = req.params.id; 

    try {
        const result = await new MeetingRoomService().deleteMeetingRoom(roomId);

        if (result.affectedRows > 0) {
            res.status(200).send({
                status: "success",
                code: 1,
                message: "Meeting room deleted successfully",
                cause: "",
                result: "",
            });
        } else {
            res.status(404).send({
                status: "fail",
                code: 0,
                message: "Meeting room not found",
                cause: "",
                result: "",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "fail",
            code: 0,
            message: error.message,
            cause: "",
            result: "",
        });
    }
};
