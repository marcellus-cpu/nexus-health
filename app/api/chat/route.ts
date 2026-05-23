import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
    try {
        const { query, conversationHistory = [] } = await req.json();
        if (!query) return NextResponse.json({ error: "No query provided" }, { status: 400 });

        const messages = [
            ...conversationHistory,
            { role: "user" as const, content: query },
        ];

        const response = await client.messages.create({
            model: "claude-sonnet-4-6",
            max_tokens: 2048,
            system: `You are Nexus AI, an expert medical education assistant built into the Nexus Health platform. You help medical students, residents, and consultants learn and understand complex medical topics.

When answering:
- Give detailed, accurate, evidence-based medical information
- Structure your response with clear headings using ## and ###
- Use bullet points for lists
- Bold important terms using **term**
- Include relevant clinical pearls and high-yield points
- Mention recent advancements where relevant
- Always remind users this is for educational purposes only

Keep responses thorough but focused. You are talking to medical professionals and students.`,
            messages,
        });

        const responseText = response.content[0].type === "text" ? response.content[0].text : "";

        return NextResponse.json({
            response: responseText,
            usage: response.usage,
        });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to get response from AI" }, { status: 500 });
    }
}
