import UserService from "./user.service.js";
import md5 from "md5";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

dotenv.config();


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
   

export const loginuser = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = md5(password);
    try {
        const result = await new UserService().loginuser(username, hashedPassword);
        if (result.length > 0) {
            const user = result[0]; 
            const token = jwt.sign({ user_id: user.user_id,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                password: user.password,
                create_at: user.create_at,
                update_at: user.update_at,
                is_active: user.is_active,
                department: user.department,
                role: user.role,
                phone_number: user.phone_number }, process.env.JWT_KEY, { expiresIn: '1h' });

            res.status(200).send({
                status: 'success',
                code: 1,
                token, // ส่ง token 
                result: {
                    user_id: user.user_id,
                    username: user.username,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    password: user.password,
                    create_at: user.create_at,
                    update_at: user.update_at,
                    is_active: user.is_active,
                    department: user.department,
                    role: user.role,
                    phone_number: user.phone_number
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

export const deleteUser = async (req, res) => {
    const { id } = req.params; 
    
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

export const updateUserController = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { firstname, lastname, email, department, phone_number } = req.body;

    try {
        const userService = new UserService();
        const user = await userService.getUserById(id);  

        if (!user) {
            return res.status(401).send({
                status: "fail",
                code: 0,
                message: "ไม่พบผู้ใช้",
                result: "",
            });
        }

        const updatedData = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password_hash: user.password_hash,  
            department: department,
            phone_number: phone_number,
        };

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
            cause: "Error updating user: " + error.message,
            result: "",
        });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const userService = new UserService();
        const user = await userService.getUserByEmail(email); 
        
        if (!user) {
            return res.status(404).send({
                status: 'error',
                message: 'ไม่พบผู้ใช้',
            });
        }

        //แสดงข้อมูลผู้ใช้ของemail
        const userInfo = {
            user_id: user.user_id,
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            email: user.email,
            role: user.role,
            department: user.department,
            phoneNumber: user.phone_number,
        };

        // สร้างรหัสยืนยัน
        const confirmationCode = crypto.randomBytes(3).toString('hex'); 
        const codeExpiry = new Date(Date.now() + 5 * 60 * 1000); // กำหนดวันหมดอายุเป็น 5 นาที

        // บันทึกรหัสยืนยันและวันหมดอายุในฐานข้อมูล
        await userService.saveConfirmationCode(user.user_id, confirmationCode, codeExpiry);

        // ส่งรหัสยืนยันไปยังอีเมลของผู้ใช้
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            to: user.email,
            subject: 'รหัสยืนยันการเปลี่ยนรหัสผ่าน',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">รหัสยืนยันการเปลี่ยนรหัสผ่าน</h2>
                <p style="font-size: 16px;">รหัสยืนยันของคุณคือ:</p>
                <p style="font-size: 32px; font-weight: bold; color: #007bff; background-color: #f8f9fa; padding: 10px; text-align: center; border-radius: 5px;">${confirmationCode}</p>
                <p style="font-size: 14px; color: #666;">รหัสนี้จะหมดอายุภายใน 15 นาที</p>
                <p style="font-size: 14px;">หากคุณไม่ได้ร้องขอการเปลี่ยนรหัสผ่าน กรุณาติดต่อเจ้าหน้าที่ทันที</p>
            </div>
        `,
        });

        res.status(200).send({
            status: 'success',
            message: 'รหัสยืนยันถูกส่งไปยังอีเมลของคุณ',
            userInfo, 
        });
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
            cause: error.message,
        });
    }
};

export const verifyConfirmationCode = async (req, res) => {
    const { confirmationCode, email } = req.body;

    if (!confirmationCode) {
        return res.status(400).send({
            status: 'error',
            message: 'กรุณากรอกรหัสยืนยันตัวตนของคุณ',
        });
    }

    try {
        const userService = new UserService();
        const user = await userService.getUserByEmail(email);

        if (!user || user.confirmation_code !== confirmationCode || user.code_expiry < new Date()) {
            return res.status(400).send({
                status: 'error',
                message: 'รหัสยืนยันไม่ถูกต้องหรือหมดอายุ',
            });
        }

        res.status(200).send({
            status: 'success',
            message: 'รหัสยืนยันถูกต้อง',
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
            cause: error.message,
        });
    }
};

export const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userService = new UserService();
        const user = await userService.getUserByEmail(email);

        if (!user) {
            return res.status(404).send({
                status: 'error',
                message: 'ไม่พบผู้ใช้',
            });
        }

        const hashedPassword = md5(newPassword);
        await userService.updatePassword(user.user_id, hashedPassword);

        await userService.clearConfirmationCode(user.user_id);

        res.status(200).send({
            status: 'success',
            message: 'รีเซ็ตรหัสผ่านสำเร็จ',
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
            cause: error.message,
        });
    }
};

export const getUserByUsername = async (req, res) => {
    const { username } = req.body; 

    if (!username) {
        return res.status(400).json({ message: 'กรุณาใส่ username' });
    }

    try {
        const userService = new UserService();
        const user = await userService.getUserByUsername(username);
        
        if (!user) {
            return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
};

export const getUserByEmailController = async (req, res) => {
    const { email } = req.body; 

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userService = new UserService(); 
        const user = await userService.getUserByEmail(email); 

        if (!user) {
            return res.status(404).send({
                status: 'error',
                message: 'ไม่พบผู้ใช้',
            });
        }

       
        res.status(200).send({
            status: 'success',
            user, 
        });
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
            cause: error.message,
        });
    }
};
