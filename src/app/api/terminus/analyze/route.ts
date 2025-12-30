// src/app/api/terminus/analyze/route.ts
import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
    try {
        const { taskPrompt, modelName = 'gpt-4o' } = await req.json();

        if (!taskPrompt) {
            return NextResponse.json(
                { success: false, error: 'taskPrompt is required' },
                { status: 400 }
            );
        }

        const systemPrompt = `You are Terminus Agent — an elite red-team evaluator testing the limits of frontier LLMs.

Analyze this adversarial coding task and simulate how the target model (${modelName}) would respond.

Task Prompt:
"""${taskPrompt}"""

Respond ONLY with valid JSON using this exact structure:
{
  "reasoning": "Detailed step-by-step reasoning trace of the LLM",
  "codeOutput": "The code the LLM would likely generate (include realistic bugs/mistakes)",
  "failurePoint": "Precise description of where the model fails or hallucinates",
  "status": "BREAKTHROUGH" if the task breaks the model, "SUCCESS" if solved perfectly
}`;

        const completion = await openai.chat.completions.create({
            model: modelName,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: 'Perform the analysis now.' }
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' },
        });

        const content = completion.choices[0]?.message?.content?.trim();
        if (!content) {
            throw new Error('Empty response from model');
        }

        const parsed = JSON.parse(content);

        return NextResponse.json({
            success: true,
            data: { ...parsed, model: modelName }
        });
    } catch (error: any) {
        console.error('Analyze API error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}