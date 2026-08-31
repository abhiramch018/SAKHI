const mongoose = require("mongoose");

const beneficiarySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        age: {
            type: Number,
            required: true,
            min: 16
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        height: {
            type: Number,
            required: true,
            min: 1
        },

        weight: {
            type: Number,
            required: true,
            min: 1
        },

        monthOfPregnancy: {
            type: Number,
            required: true,
            min: 1,
            max: 9
        },

        pregnancyNumber: {
            type: Number,
            required: true,
            min: 1
        },

        pregnancyType: {
            type: String,
            enum: ["NORMAL", "OPERATION"],
            required: true
        },

        guardianName: {
            type: String,
            required: true,
            trim: true
        },

        guardianRelation: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["ACTIVE", "COMPLETED"],
            default: "ACTIVE"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Beneficiary", beneficiarySchema);