const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema(
    {
        aww: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        period: {
            type: String,
            enum: ["WEEKLY", "MONTHLY"],
            required: true
        },

        counsellingCount: {
            type: Number,
            default: 0
        },

        learningScore: {
            type: Number,
            default: 0
        },

        overallScore: {
            type: Number,
            default: 0
        },

        periodStart: {
            type: Date,
            required: true
        },

        periodEnd: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Performance", performanceSchema);