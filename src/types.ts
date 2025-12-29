// src/types.ts
export type TerminalLine = {
    text: string;
    type: 'input' | 'output' | 'system' | 'success' | 'error';
    timestamp: Date;
};

export type Task = {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    language: string;
    prompt: string;
};

export type LLMAnalysis = {
    model: string;
    reasoning: string;
    codeOutput: string;
    failurePoint: string;
    status: 'BREAKTHROUGH' | 'SUCCESS';
};