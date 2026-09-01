const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;
const DEFAULT_MODEL = "gemini-3.6-flash";

const DEPRECATED_MODELS = new Set([
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
    "gemini-2.0-flash-001",
    "gemini-2.0-flash-lite"
]);

const normalizeModel = (envModel) => {
    if (!envModel || DEPRECATED_MODELS.has(envModel) || /^gemini-2\./.test(envModel)) {
        return DEFAULT_MODEL;
    }
    return envModel;
};

const model = normalizeModel(process.env.GEMINI_MODEL);

let client = null;

const getClient = () => {
    if (!apiKey) {
        throw new Error(
            "AI service is not configured. Set GEMINI_API_KEY in backend .env."
        );
    }
    if (!client) {
        client = new GoogleGenAI({ apiKey });
    }
    return client;
};

/**
 * Generate text from a system prompt and user prompt using Gemini.
 */
const generateText = async (systemPrompt, userPrompt) => {
    const ai = getClient();

    const response = await ai.models.generateContent({
        model,
        contents: [
            {
                role: "user",
                parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
            }
        ]
    });

    const text = response.text;

    if (!text || text.trim().length === 0) {
        throw new Error("AI service returned an empty response.");
    }

    return text;
};

module.exports = {
    getClient,
    generateText,
    getModel: () => model
};
