const mongoose = require("mongoose");

const counsellingSchema = new mongoose.Schema(
    {
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

        tier: {
            type: Number,
            enum: [1, 2, 3],
            required: true
        },

        answers: [
            {
                questionId: {
                    type: String,
                    required: true
                },

                answer: {
                    type: String,
                    required: true
                }
            }
        ],

        counsellingDate: {
            type: Date,
            default: Date.now
        },

        attendance: {
            type: Boolean,
            default: false
        },

        status: {
            type: String,
            enum: ["IN_PROGRESS", "COMPLETED"],
            default: "IN_PROGRESS"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Counselling", counsellingSchema);