const { generateText } = require("../config/gemini");

const SYSTEM_PROMPT = `You are a counselling assistant for an Anganwadi Worker (AWW) supporting maternal and child health in India.

Provide simple, clear, practical guidance.
Do not diagnose the beneficiary.
Do not invent medical conditions.
If hospital referral is present, clearly tell the AWW to follow the approved referral action.`;

const generateGuidance = async (assessment, language = "English") => {
    const userPrompt = `Based only on the following structured assessment, provide counselling guidance.

Assessment:
Risk Level: ${assessment.riskLevel}
Actions: ${(assessment.actions || []).join(", ")}

IMPORTANT: Write your entire response in ${language}. Use simple language suitable for an Anganwadi Worker.

Return:
1. Main counselling points
2. Important precautions
3. When to seek medical help`;

    return generateText(SYSTEM_PROMPT, userPrompt);
};

module.exports = {
    generateGuidance
};
