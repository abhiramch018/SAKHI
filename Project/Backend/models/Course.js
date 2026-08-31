const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        videoUrl: {
            type: String,
            required: true
        },

        questions: [
            {
                question: {
                    type: String,
                    required: true
                },

                options: [
                    {
                        type: String,
                        required: true
                    }
                ],

                correctAnswer: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Course", courseSchema);