const decisionTreeService = require("../services/decisionTree.service");

const evaluateDecisionTree = async (req, res) => {
    try {
        const { tier, answers } = req.body;

        if (!tier || !answers || !Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                message: "Tier and answers are required"
            });
        }

        const result =
            await decisionTreeService.evaluateDecisionTree(
                tier,
                answers
            );

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    evaluateDecisionTree
};