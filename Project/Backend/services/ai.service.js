const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const generateGuidance = async (assessment) => {
    const prompt = `
You are a counselling assistant for an Anganwadi Worker (AWW).

Based only on the following structured assessment, provide
simple and clear counselling guidance.

Assessment:
Risk Level: ${assessment.riskLevel}
Actions: ${assessment.actions.join(", ")}

Do not diagnose the beneficiary.
Do not invent medical conditions.
If hospital referral is present, clearly tell the AWW
to follow the approved referral action.

Return:
1. Main counselling points
2. Important precautions
3. When to seek medical help
`;

    const response = await client.responses.create({
        model: "gpt-5-mini",
        input: prompt
    });

    return response.output_text;
};

module.exports = {
    generateGuidance
};