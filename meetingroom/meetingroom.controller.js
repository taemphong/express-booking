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

export const addMeetingRoomDetailsController = async (req, res) => {
    const roomId = req.params.room_id; 

    const details = req.files.map(file => ({
        room_id: roomId,
        image_url: file.path,
        description: req.body.description || null, 
    }));

    try {
        for (const detail of details) {
            await meetingRoomService.insertMeetingRoomDetail(detail);
        }

        res.status(201).send({
            status: "success",
            code: 1,
            message: "Meeting room details added successfully",
            cause: "",
            result: details,
        });
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

export const getMeetingRoomDetailsByRoomIdController = async (req, res) => {
    const roomId = req.params.room_id; 

    try {
        const details = await meetingRoomService.getMeetingRoomDetailsByRoomId(roomId);

        if (details.length === 0) {
            return res.status(404).send({
                status: "fail",
                code: 0,
                message: "ไม่พบรายละเอียดสำหรับห้องประชุมนี้",
                cause: "",
                result: [],
            });
        }

        res.status(200).send({
            status: "success",
            code: 1,
            message: "ดึงรายละเอียดห้องประชุมสำเร็จ",
            cause: "",
            result: details,
        });
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

export const getMeetingRoomDetailsByDetailIdController = async (req, res) => {
    const detailId = req.params.detail_id; 

    try {
        const details = await meetingRoomService.getMeetingRoomDetailsByDetailId(detailId);

        if (!details.length) {
            return res.status(404).send({
                status: "fail",
                code: 0,
                message: "ไม่พบรายละเอียดห้องประชุมที่ต้องการ",
                cause: "",
                result: "",
            });
        }

        res.status(200).send({
            status: "success",
            code: 1,
            message: "ดึงรายละเอียดห้องประชุมเรียบร้อยแล้ว",
            cause: "",
            result: details[0], 
        });
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

export const updateMeetingRoomDetailsController = async (req, res) => {
    const detailId = req.params.detail_id; 
    const { description } = req.body; 
    const newImage = req.file; 

    try {
      
        const currentDetail = await meetingRoomService.getMeetingRoomDetailsByDetailId(detailId);

        if (!currentDetail.length) {
            return res.status(404).send({
                status: "fail",
                code: 0,
                message: "ไม่พบรายละเอียดห้องประชุมที่ต้องการอัปเดต",
                cause: "",
                result: "",
            });
        }

        
        const updateData = {
            image_url: newImage ? newImage.path : currentDetail[0].image_url, 
            description: description !== undefined ? description : currentDetail[0].description, 
        };

        const updatedDetail = await meetingRoomService.updateMeetingRoomDetail(detailId, updateData);

        if (updatedDetail.affectedRows === 0) {
            return res.status(404).send({
                status: "fail",
                code: 0,
                message: "ไม่สามารถอัปเดตรายละเอียดห้องประชุมได้",
                cause: "",
                result: "",
            });
        }

        res.status(200).send({
            status: "success",
            code: 1,
            message: "รายละเอียดห้องประชุมถูกอัปเดตเรียบร้อยแล้ว",
            cause: "",
            result: {
                detailId,
                image_url: updateData.image_url,
                description: updateData.description,
            },
        });
    } catch (error) {
        console.log("Error during update:", error);
        res.status(500).send({
            status: "fail",
            code: 0,
            message: error.message,
            cause: "",
            result: "",
        });
    }
};

export const addDescriptionController = async (req, res) => {
    const { room_id, description_text } = req.body;

    const meetingRoomService = new MeetingRoomService();

    try {
        const meetingRoom = await meetingRoomService.getMeetingRoomById(room_id);
        if (!meetingRoom) {
            return res.status(404).send({
                status: 'error',
                message: 'ไม่พบห้องประชุมที่มีรหัสนี้',
            });
        }

        const newDescription = await meetingRoomService.addDescription(room_id, description_text);

        res.status(201).send({
            status: 'success',
            message: 'เพิ่มคำอธิบายสำเร็จ',
            data: newDescription,
        });
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
            cause: error.message,
        });
    }
};

export const updateDescriptionByRoomController = async (req, res) => {
    const { room_id } = req.params; 
    const { description_text } = req.body; 

    const meetingRoomService = new MeetingRoomService();

    try {
     
        const meetingRoom = await meetingRoomService.getMeetingRoomById(room_id);
        if (!meetingRoom) {
            return res.status(404).send({
                status: 'error',
                message: 'ไม่พบห้องประชุมที่มีรหัสนี้',
            });
        }

        const updatedResult = await meetingRoomService.updateDescriptionByRoom(room_id, { description_text });

        res.status(200).send({
            status: 'success',
            message: 'อัปเดตคำอธิบายสำเร็จ',
            data: updatedResult,
        });
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
            cause: error.message,
        });
    }
};


export const deleteDescriptionByRoomController = async (req, res) => {
    const { room_id } = req.params; 

    const meetingRoomService = new MeetingRoomService();

    try {
      
        const meetingRoom = await meetingRoomService.getMeetingRoomById(room_id);
        if (!meetingRoom) {
            return res.status(404).send({
                status: 'error',
                message: 'ไม่พบห้องประชุมที่มีรหัสนี้',
            });
        }

        const deleteResult = await meetingRoomService.deleteDescriptionByRoom(room_id);

        res.status(200).send({
            status: 'success',
            message: 'ลบคำอธิบายสำเร็จ',
            data: deleteResult,
        });
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
            cause: error.message,
        });
    }
};

export const getDescriptionByRoomIdController = async (req, res) => {
    const { room_id } = req.params; 

    const meetingRoomService = new MeetingRoomService();

    try {
        const description = await meetingRoomService.getDescriptionByRoomId(room_id);
        if (!description) {
            return res.status(404).send({
                status: 'error',
                message: 'ไม่พบคำอธิบายสำหรับห้องประชุมนี้',
            });
        }

        res.status(200).send({
            status: 'success',
            message: 'ดึงคำอธิบายสำเร็จ',
            data: description,
        });
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
            cause: error.message,
        });
    }
};
