import UserService from "./user.service.js";
import md5 from "md5";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';

dotenv.config();

//ดึงข้อมูล user ทั้งหมด
export const getUsers = async (req, res) => {
    try {
        const result = await new UserService().getUsers();
        if (result.length > 0) {
            res.status(200).send({
                status: "สำเร็จ success",
                result: result,
            });
        } else {
            res.status(200).send({
                status: "สำเร็จ success",
                code: 1,
                message: "ไม่มีข้อมูล",
                cause: "",
                result: "",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: "error",
            code: 0,
            message: "Internal Server Error",
            cause: error.message,
            result: "",
        });
    }
};

//ดึงข้อมูล user ด้วย id
export const getUserById = async (req, res) => {
    const { id } = req.params; 
    try {
        const result = await new UserService().getUserById(id); 
        if (result) {
            res.status(200).send({
                status: "สำเร็จ success",
                result: result,
            });
        } else {
            res.status(404).send({
                status: "fail",
                code: 0,
                message: "ไม่มีข้อมูลผู้ใช้ User not found",
                result: "",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: "error",
            code: 0,
            message: "ข้อผิดพลาดในระบบ Internal Server Error",
            cause: error.message,
            result: "",
        });
    }
};

//สร้าง account user ใช้ validationResult เช็คการใส่ข้อมูลต้องใส่ข้อมูลที่ถูกต้อง
export const insertUser = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

     const user = {
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password_hash: md5(req.body.password),  
        department: req.body.department,
        role: req.body.role || 'user',
        phone_number: req.body.phone_number,
    };
    console.log(user)
    try {
        const result = await new UserService().insertUser(user);
        console.log(user);
    
        if (result.insertId) {
          res.status(200).send({
            status: "สำเร็จ success",
            code: 1,
            message: "",
            cause: "",
            result,
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
   

//เช็คข้อมูล user หรือ admin เพื่อเข้าสู่ระบบจะให้ token มา ใช้token เพื่อเช็คว่าเป็น user หรือ admin
export const loginuser = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = md5(password);
    try {
        const result = await new UserService().loginuser(username, hashedPassword);
        if (result.length > 0) {
            const user = result[0]; // สมมุติว่าเราจะใช้ข้อมูลผู้ใช้ตัวแรก
            const token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_KEY, { expiresIn: '1h' });

            res.status(200).send({
                status: 'success',
                code: 1,
                token, // ส่ง token กลับไป
                result: {
                    user_id: user.user_id,
                    username: user.username,
                    role: user.role,
                },
            });
        } else {
            const userCheck = await new UserService().checkUserExists(username);
            if (!userCheck) {
                res.status(404).send({
                    status: 'error',
                    code: 0,
                    message: 'No data username or you may not have signed up yet.',
                    cause: 'User not found',
                    result: '',
                });
            } else {
                res.status(401).send({
                    status: 'error',
                    code: 0,
                    message: 'Invalid username or password.',
                    cause: 'Authentication failed',
                    result: '',
                });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 'error',
            code: 0,
            message: 'Internal Server Error',
            cause: error.message,
            result: '',
        });
    }
};

//ลบ user ออกจากระบบถ้า userมีการจองห้องประชุมค้างอยู่จะลบข้อมูลการจองออกด้วย
export const deleteUser = async (req, res) => {
    const { id } = req.params; 
    console.log(id)

    try {
        const result = await new UserService().deleteUser(id); 
        if (result.affectedRows > 0) {
            res.status(200).send({
                status: "success",
                message: "User deleted successfully",
                result: "",
            });
        } else {
            res.status(404).send({
                status: "fail",
                code: 0,
                message: "User not found",
                result: "",
            });
        }
    } catch (error) {
        console.error(error); 
        res.status(500).send({
            status: "error",
            code: 0,
            message: "Internal Server Error",
            cause: error.message,
            result: "",
        });
    }
};

//อัปเดตข้อมูล user มีการต้องตรวจสอบ username กับ password ก่อนนะเปลี่ยนแปลงข้อมูล
export const updateUserController = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const { username, password, newPassword, firstname, lastname, email, department,  phone_number } = req.body;

    try {
        // 1. ตรวจสอบข้อมูลผู้ใช้จาก username และ password ปัจจุบัน
        const userService = new UserService();
        const hashedPassword = md5(password);
        const user = await userService.loginuser(username, hashedPassword);

        if (!user || user.length === 0) {
            return res.status(401).send({
                status: "fail",
                code: 0,
                message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
                result: "",
            });
        }

        // 2. เตรียมข้อมูลที่ต้องการอัปเดต
        const updatedData = {
            username: username,
            firstname: firstname,
            lastname: lastname,
            email: email,
            password_hash: newPassword ? md5(newPassword) : user.password_hash,  // อัปเดตรหัสผ่านถ้ามี
            department: department,
            phone_number: phone_number,
        };

        // 3. ทำการอัปเดตข้อมูลในฐานข้อมูล
        const result = await userService.updateUser(id, updatedData);

        if (result.affectedRows) {
            res.status(200).send({
                status: "success",
                message: "ข้อมูลผู้ใช้อัปเดตสำเร็จ",
                result,
            });
        } else {
            res.status(404).send({
                status: "fail",
                code: 0,
                message: "ไม่พบผู้ใช้",
                result: "",
            });
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            code: 0,
            message: "เกิดข้อผิดพลาดในระบบ",
            cause: error.message,
            result: "",
        });
    }
};