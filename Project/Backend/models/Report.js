const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        counselling: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Counselling",
            required: true
        },

        beneficiary: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Beneficiary",
            required: true
        },

        aww: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        riskLevel: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
            required: true
        },

        actions: [
            {
                type: String
            }
        ],

        aiGuidance: {
            type: String,
            default: ""
        },

        reportDate: {
            type: Date,
            default: Date.now
        },

        beneficiaryFeedback: {
            rating: {
                type: Number,
                min: 1,
                max: 5
            },
            comment: {
                type: String,
                trim: true,
                default: ""
            },
            submittedAt: {
                type: Date
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Report", reportSchema);