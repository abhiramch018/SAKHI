const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        minCounselling: {
            type: Number,
            required: true,
            min: 0
        },

        maxCounselling: {
            type: Number,
            required: true,
            min: 0
        },

        reward: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Milestone", milestoneSchema);