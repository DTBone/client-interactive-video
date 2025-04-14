import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * API handler for OpenAI chat completions
 * @param {Request} req - The incoming request object
 * @returns {Promise<StreamingTextResponse>} The streaming text response
 */
export async function POST(req) {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        stream: true,
        messages: messages,
        max_tokens: 16,
        temperature: 0.1,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
}