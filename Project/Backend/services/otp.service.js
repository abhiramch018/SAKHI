const OTP = require("../models/OTP");
const User = require("../models/User");
const transporter = require("../config/mailer");

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp) => {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASSWORD) {
        throw new Error(
            "Email service is not configured. Set MAIL_USER and MAIL_PASSWORD in .env (use a Gmail App Password)."
        );
    }

    try {
        await transporter.sendMail({
            from: `"SAKHI" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "SAKHI - Email Verification OTP",
            text: `Your SAKHI verification OTP is ${otp}. It is valid for 5 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
                    <h2 style="color: #0f766e;">SAKHI</h2>
                    <p>Your email verification code is:</p>
                    <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #0f766e;">${otp}</p>
                    <p style="color: #666; font-size: 14px;">This code expires in 5 minutes. Do not share it with anyone.</p>
                </div>
            `
        });
    } catch (error) {
        const detail = error.message || "Unknown mail error";
        throw new Error(
            `Unable to send OTP email. Verify MAIL_USER and MAIL_PASSWORD in .env (Gmail App Password required). ${detail}`
        );
    }
};

const sendOTP = async (email) => {
    const normalizedEmail = email.toLowerCase().trim();
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.deleteMany({ email: normalizedEmail });

    const record = await OTP.create({
        email: normalizedEmail,
        otp,
        expiresAt
    });

    try {
        await sendOTPEmail(normalizedEmail, otp);
    } catch (error) {
        await OTP.deleteOne({ _id: record._id });
        throw error;
    }
};

const sendRegistrationOTP = async ({ email, name, phone, passwordHash }) => {
    const normalizedEmail = email.toLowerCase().trim();
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.deleteMany({ email: normalizedEmail });

    const record = await OTP.create({
        email: normalizedEmail,
        otp,
        expiresAt,
        pendingRegistration: {
            name,
            phone,
            passwordHash
        }
    });

    try {
        await sendOTPEmail(normalizedEmail, otp);
    } catch (error) {
        await OTP.deleteOne({ _id: record._id });
        throw error;
    }
};

const verifyOTP = async (email, otp) => {
    const normalizedEmail = email.toLowerCase().trim();

    const otpRecord = await OTP.findOne({
        email: normalizedEmail,
        otp
    });

    if (!otpRecord) {
        throw new Error("Invalid OTP");
    }

    if (otpRecord.expiresAt < new Date()) {
        await OTP.deleteOne({ _id: otpRecord._id });
        throw new Error("OTP expired");
    }

    if (otpRecord.pendingRegistration) {
        const { name, phone, passwordHash } = otpRecord.pendingRegistration;

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            await OTP.deleteOne({ _id: otpRecord._id });
            throw new Error("User already exists");
        }

        await User.create({
            name,
            email: normalizedEmail,
            phone,
            password: passwordHash,
            role: "AWW"
        });

        await OTP.deleteOne({ _id: otpRecord._id });

        return { registrationCompleted: true };
    }

    await OTP.deleteOne({ _id: otpRecord._id });

    return { registrationCompleted: false };
};

module.exports = {
    sendOTP,
    sendRegistrationOTP,
    verifyOTP
};
