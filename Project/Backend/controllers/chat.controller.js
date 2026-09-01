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
        const message = error.message || "AI service error";
        const isModelError = /no longer available|NOT_FOUND|models\//i.test(message);
        const isAuthError =
            error.status === 401 ||
            error.status === 403 ||
            /api key|401|403|authentication|permission/i.test(message);

        res.status(isAuthError ? 503 : 500).json({
            success: false,
            message: isAuthError
                ? "AI service is unavailable. Check GEMINI_API_KEY in backend .env."
                : isModelError
                ? "AI model configuration is outdated. Restart the backend after setting GEMINI_MODEL=gemini-3.6-flash."
                : message
        });
    }
};

module.exports = {
    chat
};