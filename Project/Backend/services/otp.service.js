const OTP = require("../models/OTP");
const transporter = require("../config/mailer");

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (email) => {
    const otp = generateOTP();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.deleteMany({ email });

    await OTP.create({
        email,
        otp,
        expiresAt
    });

    await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: "AWW Platform - OTP Verification",
        text: `Your OTP is ${otp}. It is valid for 5 minutes.`
    });
};

const verifyOTP = async (email, otp) => {
    const otpRecord = await OTP.findOne({
        email,
        otp
    });

    if (!otpRecord) {
        throw new Error("Invalid OTP");
    }

    if (otpRecord.expiresAt < new Date()) {
        await OTP.deleteOne({ _id: otpRecord._id });
        throw new Error("OTP expired");
    }

    await OTP.deleteOne({ _id: otpRecord._id });

    return true;
};

module.exports = {
    sendOTP,
    verifyOTP
};