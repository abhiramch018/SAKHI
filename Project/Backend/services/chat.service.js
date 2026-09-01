const { generateText } = require("../config/gemini");

const SYSTEM_PROMPT = `You are a helpful counselling assistant for an Anganwadi Worker (AWW) supporting maternal and child health in India.

Keep answers simple, clear, and easy for an AWW or beneficiary to understand.
Do not diagnose medical conditions.
Do not replace a doctor.
If the question describes an emergency or serious warning sign, advise the AWW to follow the approved referral process.`;

const getChatResponse = async (question, language = "English") => {
    const userPrompt = `Answer the following question in ${language}:

${question}`;

    return generateText(SYSTEM_PROMPT, userPrompt);
};

module.exports = {
    getChatResponse
};
