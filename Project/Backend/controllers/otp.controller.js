const otpService = require("../services/otp.service");

const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        await otpService.sendOTP(email);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        await otpService.verifyOTP(email, otp);

        res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    sendOTP,
    verifyOTP
};