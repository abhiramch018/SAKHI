const chatService = require("../services/chat.service");

const chat = async (req, res) => {
    try {
        const { question, language } = req.body;

        if (!question) {
            return res.status(400).json({
                success: false,
                message: "Question is required"
            });
        }

        const answer = await chatService.getChatResponse(
            question,
            language || "English"
        );

        res.status(200).json({
            success: true,
            data: {
                question,
                answer,
                language: language || "English"
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    chat
};