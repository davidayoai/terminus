// src/app/api/generate/route.ts
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
    baseURL: process.env.OPENAI_BASE_URL!,
});

export async function POST(request: Request) {
    try {
        const { topic } = await request.json();

        const prompt = `Generate a highly adversarial terminal-based coding task about "${topic}" that is likely to cause reasoning failures in LLMs.

Focus on: recursive Docker, Python metaclasses, obscure bash, signal handling, race conditions.

Return ONLY valid JSON:
{
  "title": "Short dramatic title",
  "description": "Detailed description",
  "difficulty": "HARD" or "EXTREME",
  "language": "Python" or "Bash/Docker" or "CLI",
  "prompt": "The exact prompt to feed an LLM"
}`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 1.0,
            response_format: { type: 'json_object' },
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) {
            return NextResponse.json({ error: 'No response' }, { status: 500 });
        }

        const data = JSON.parse(content);

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('Generate error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate task' },
            { status: 500 }
        );
    }
}

export const runtime = 'nodejs';