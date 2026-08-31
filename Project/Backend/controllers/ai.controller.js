const aiService = require("../services/ai.service");

const generateGuidance = async (req, res) => {
    try {
        const { assessment } = req.body;

        if (!assessment) {
            return res.status(400).json({
                success: false,
                message: "Assessment is required"
            });
        }

        const guidance =
            await aiService.generateGuidance(assessment);

        res.status(200).json({
            success: true,
            data: {
                guidance
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
    generateGuidance
};