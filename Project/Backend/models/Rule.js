const mongoose = require("mongoose");

const ruleSchema = new mongoose.Schema(
    {
        tier: {
            type: Number,
            enum: [1, 2, 3],
            required: true
        },

        questionId: {
            type: String,
            required: true,
            trim: true
        },

        expectedAnswer: {
            type: String,
            required: true,
            trim: true
        },

        riskLevel: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
            required: true
        },

        action: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Rule", ruleSchema);