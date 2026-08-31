const Rule = require("../models/Rule");

const evaluateDecisionTree = async (tier, answers) => {
    const rules = await Rule.find({ tier });

    let riskLevel = "LOW";
    let actions = [];

    for (const rule of rules) {
        const answer = answers.find(
            (item) => item.questionId === rule.questionId
        );

        if (
            answer &&
            answer.answer.toUpperCase() ===
                rule.expectedAnswer.toUpperCase()
        ) {
            actions.push(rule.action);

            if (rule.riskLevel === "HIGH") {
                riskLevel = "HIGH";
            } else if (
                rule.riskLevel === "MEDIUM" &&
                riskLevel !== "HIGH"
            ) {
                riskLevel = "MEDIUM";
            }
        }
    }

    return {
        riskLevel,
        actions
    };
};

module.exports = {
    evaluateDecisionTree
};