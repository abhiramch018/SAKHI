const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        otp: {
            type: String,
            required: true
        },

        expiresAt: {
            type: Date,
            required: true
        },

        pendingRegistration: {
            name: {
                type: String,
                trim: true
            },
            phone: {
                type: String,
                trim: true
            },
            passwordHash: {
                type: String
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("OTP", otpSchema);