import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendBookingNotification = async (bookingDetails) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: 'การแจ้งเตือนการจองใหม่',
        html: `
            <h2>มีการจองใหม่!</h2>
            <p><strong>รายละเอียดการจอง:</strong></p>
            <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
                <tr>
                    <td><strong>User ID</strong></td>
                    <td>${bookingDetails.user_id}</td>
                </tr>
                <tr>
                    <td><strong>Room ID</strong></td>
                    <td>${bookingDetails.room_id}</td>
                </tr>
                <tr>
                    <td><strong>วันที่จอง</strong></td>
                    <td>${bookingDetails.booking_date}</td>
                </tr>
                <tr>
                    <td><strong>เวลาเริ่ม</strong></td>
                    <td>${bookingDetails.start_time}</td>
                </tr>
                <tr>
                    <td><strong>เวลาสิ้นสุด</strong></td>
                    <td>${bookingDetails.end_time}</td>
                </tr>
                <tr>
                    <td><strong>วัตถุประสงค์</strong></td>
                    <td>${bookingDetails.purpose}</td>
                </tr>
                <tr>
                    <td><strong>สถานะ</strong></td>
                    <td>${bookingDetails.status}</td>
                </tr>
            </table>
            <p>โปรดตรวจสอบการจองนี้ในระบบ.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('การแจ้งเตือนการจองส่งเรียบร้อยแล้ว.');
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการส่งการแจ้งเตือนการจอง:', error);
    }
};
