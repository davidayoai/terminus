// services/geminiService.ts
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateTaskAnalysis = async (taskPrompt: string, modelName: string) => {
    const prompt = `
    You are acting as a "Terminus Agent" evaluating a coding task designed to break an LLM.
    Task Prompt: ${taskPrompt}
    Target Model: ${modelName}

    Analyze this task. Simulate how a high-level LLM would attempt to solve it, and identify the exact "Failure Point" where current reasoning capabilities might break down (e.g., circular logic, recursive context limits, complex Docker configurations, or specific Python edge cases).

    Return your analysis in the following JSON structure:
    {
      "reasoning": "A step-by-step trace of how the LLM processes this.",
      "codeOutput": "The (likely buggy or incomplete) code the LLM would produce.",
      "failurePoint": "The specific reason why the LLM fails this benchmark.",
      "status": "BREAKTHROUGH" (if LLM fails) or "SUCCESS" (if LLM solves it)
    }
  `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        reasoning: { type: Type.STRING },
                        codeOutput: { type: Type.STRING },
                        failurePoint: { type: Type.STRING },
                        status: { type: Type.STRING }
                    },
                    required: ["reasoning", "codeOutput", "failurePoint", "status"]
                }
            }
        });

        return JSON.parse(response.text);
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};

export const generateNewTask = async (topic: string) => {
    const prompt = `Generate a highly complex, adversarial coding task for ${topic} that is likely to cause context overflow or reasoning errors in LLMs. Focus on recursive dependencies, complex CLI tooling, or Docker networking edge cases.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        difficulty: { type: Type.STRING },
                        language: { type: Type.STRING },
                        prompt: { type: Type.STRING }
                    }
                }
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Gemini API Error:", error);
        return null;
    }
};
