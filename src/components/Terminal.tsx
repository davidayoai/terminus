// src/components/Terminal.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { TerminalLine } from '../types';

interface TerminalProps {
    lines: TerminalLine[];
    onCommand: (command: string) => void;
    isProcessing: boolean;
}

const Terminal: React.FC<TerminalProps> = ({ lines, onCommand, isProcessing }) => {
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }, [lines]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isProcessing && inputValue.trim()) {
            onCommand(inputValue.trim());
            setInputValue('');
        }
    };

    const getColor = (type: TerminalLine['type']) => {
        switch (type) {
            case 'input': return 'text-white';
            case 'output': return 'text-green-400';
            case 'system': return 'text-yellow-500 opacity-80';
            case 'success': return 'text-cyan-400 font-bold';
            case 'error': return 'text-red-500';
            default: return 'text-green-300';
        }
    };

    return (
        <div className="flex flex-col h-full bg-black/60 border border-green-900/40 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between px-4 py-2 bg-green-950/30 border-b border-green-900/30">
                <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="text-xs font-bold text-green-400 tracking-widest uppercase">
                    Terminus Terminal v3.1.0
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 font-mono text-sm">
                {lines.map((line, i) => (
                    <div key={i} className="mb-1 break-words">
                        {line.type === 'input' && <span className="text-pink-400 mr-2">$</span>}
                        <span className={getColor(line.type)}>{line.text}</span>
                    </div>
                ))}
                {isProcessing && (
                    <div className="text-green-400 animate-pulse">
                        Processing agent...
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-green-900/30 bg-green-950/20">
                <div className="flex items-center">
                    <span className="text-pink-400 mr-2 font-bold">$</span>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isProcessing}
                        autoComplete="off"
                        className="flex-1 bg-transparent outline-none text-white font-mono"
                        placeholder={isProcessing ? 'Executing…' : 'Type a command'}
                    />
                </div>
            </form>
        </div>
    );
};

export default Terminal;
