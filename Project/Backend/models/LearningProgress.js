const mongoose = require("mongoose");

const learningProgressSchema = new mongoose.Schema(
    {
        aww: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },

        completed: {
            type: Boolean,
            default: false
        },

        quizScore: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "LearningProgress",
    learningProgressSchema
);