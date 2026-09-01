const aiService = require("../services/ai.service");

const generateGuidance = async (req, res) => {
    try {
        const { assessment, language } = req.body;

        if (!assessment) {
            return res.status(400).json({
                success: false,
                message: "Assessment is required"
            });
        }

        const guidance =
            await aiService.generateGuidance(assessment, language || "English");

        res.status(200).json({
            success: true,
            data: {
                guidance
            }
        });
    } catch (error) {
        const message = error.message || "AI service error";
        const isModelError = /no longer available|NOT_FOUND|models\//i.test(message);
        const isAuthError =
            error.status === 401 ||
            error.status === 403 ||
            error.code === "invalid_api_key" ||
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
    generateGuidance
};