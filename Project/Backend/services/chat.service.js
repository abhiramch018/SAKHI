const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const getChatResponse = async (question, language = "English") => {
    const prompt = `
You are a helpful counselling assistant for an Anganwadi Worker (AWW).

Answer the user's question in ${language}.

Keep the answer:
- Simple
- Clear
- Easy for an AWW or beneficiary to understand

Do not diagnose medical conditions.
Do not replace a doctor.
If the question describes an emergency or serious warning sign,
advise the AWW to follow the approved referral process.

User question:
${question}
`;

    const response = await client.responses.create({
        model: "gpt-5-mini",
        input: prompt
    });

    return response.output_text;
};

module.exports = {
    getChatResponse
};