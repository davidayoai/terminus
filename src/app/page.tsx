// src/app/page.tsx

'use client';
import React, { useState, useEffect } from 'react';
import { TerminalLine, Task, LLMAnalysis } from '@/types';
import Terminal from '@/components/Terminal';
import { Terminal as TerminalIcon, Cpu, Zap, Bug, ShieldCheck, Settings } from 'lucide-react';

export default function App() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '101',
      title: 'Docker-in-Docker Recursion',
      description: 'Create a multi-node swarm cluster that attempts to self-host its own registry inside a nested container with shared socket access.',
      difficulty: 'HARD',
      language: 'Bash/Docker',
      prompt: 'Write a script to deploy a recursive dind structure with mTLS and a custom CA provider.'
    },
    {
      id: '102',
      title: 'Python Metaclass Injection',
      description: 'Bypass a strict static analysis tool by using dynamic metaclass generation for runtime obfuscation.',
      difficulty: 'EXTREME',
      language: 'Python',
      prompt: 'Design a system where classes inherit behavior from objects that are instantiated via custom __call__ overrides in a singleton metaclass.'
    }
  ]);
  const [analysis, setAnalysis] = useState<LLMAnalysis | null>(null);

  const addLine = (text: string, type: TerminalLine['type'] = 'output') => {
    setLines(prev => [...prev, { text, type, timestamp: new Date() }]);
  };

  useEffect(() => {
    addLine('PROJECT TERMINUS [Version 3.1.0]', 'system');
    addLine('Initializing environment variables...', 'system');
    addLine('export OPENAI_API_KEY=)', 'system');
    addLine('export OPENAI_BASE_URL=https://api.portkey.ai/v1', 'system');
    addLine('Ready for input. Type "help" for available commands.', 'success');
  }, []);

  const handleCommand = async (command: string) => {
    addLine(command, 'input');
    const cmd = command.trim().toLowerCase();

    if (cmd === 'help') {
      addLine('Available Commands:', 'output');
      addLine('  help                     - Show this help menu', 'output');
      addLine('  clear                    - Clear the terminal screen', 'output');
      addLine('  ls tasks                 - List all adversarial tasks', 'output');
      addLine('  cat task <id>            - Show details for a specific task', 'output');
      addLine('  tb run --task-id <id>    - Run an LLM breaker agent on task', 'output');
      addLine('  tb task create <topic>   - Generate a new adversarial task', 'output');
      addLine('  env                      - Show current environment variables', 'output');
    } else if (cmd === 'clear') {
      setLines([]);
    } else if (cmd === 'ls tasks') {
      addLine('Adversarial Repository:', 'success');
      tasks.forEach(t => {
        addLine(`[${t.id}] ${t.title} (${t.difficulty})`, 'output');
      });
    } else if (cmd === 'env') {
      addLine('ACTIVE_AGENT=terminus', 'output');
      addLine('MODEL_ENDPOINT=gpt-4o (via Portkey)', 'output');
      addLine('API_KEY=kkhew+QoeRAovQpeA758RifFqIK+ (Configured)', 'output');
    } else if (cmd.startsWith('cat task ')) {
      const id = cmd.split(' ').pop();
      const task = tasks.find(t => t.id === id);
      if (task) {
        addLine(`--- TASK ${task.id}: ${task.title} ---`, 'success');
        addLine(`Difficulty: ${task.difficulty}`, 'output');
        addLine(`Language: ${task.language}`, 'output');
        addLine(`Description: ${task.description}`, 'output');
        addLine(`Prompt: ${task.prompt}`, 'system');
      } else {
        addLine(`Error: Task ${id} not found.`, 'error');
      }
    } else if (cmd.startsWith('tb run')) {
      const idMatch = command.match(/--task-id\s+(\d+)/);
      const modelMatch = command.match(/--model\s+([\w/-]+)/);
      const model = modelMatch ? modelMatch[1] : 'gpt-4o';
      const id = idMatch ? idMatch[1] : null;

      if (!id) {
        addLine('Error: Missing required argument --task-id', 'error');
        return;
      }

      const task = tasks.find(t => t.id === id);
      if (!task) {
        addLine(`Error: Task ${id} not found.`, 'error');
        return;
      }

      setIsProcessing(true);
      addLine(`Initiating Terminus Agent on ${model}...`, 'system');
      addLine(`Injecting payload: ${task.title}`, 'system');

      try {
        const res = await fetch('/api/terminus/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskPrompt: task.prompt,
            modelName: model,  // ← This matches your API route exactly
          }),
        });

        // Important: Check if the response is OK before parsing JSON
        if (!res.ok) {
          const text = await res.text();
          console.error('API Error Response:', text);
          throw new Error(`API returned ${res.status}: ${text.substring(0, 200)}`);
        }

        const json = await res.json();

        if (!json.success) {
          throw new Error(json.error || 'Unknown API error');
        }

        const result = json.data;
        setAnalysis(result);

        addLine('Analysis complete.', 'success');
        if (result.status === 'BREAKTHROUGH') {
          addLine('--- [BREAKTHROUGH DETECTED] ---', 'success');
          addLine(`Failure Mode: ${result.failurePoint}`, 'output');
        } else {
          addLine('--- [TASK SOLVED] ---', 'error');
          addLine('Warning: Current LLM handled this correctly.', 'error');
        }
      } catch (err: any) {
        addLine(`ERROR: ${err.message}`, 'error');
        console.error('Fetch error:', err);
      } finally {
        setIsProcessing(false);
      }
    } else if (cmd.startsWith('tb task create')) {
      const topic = command.split(' ').slice(3).join(' ') || 'Cloud Infrastructure';
      setIsProcessing(true);
      addLine(`Synthesizing new adversarial task for: ${topic}...`, 'system');

      try {
        const res = await fetch('/api/terminus/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic }),
        });

        const json = await res.json();

        if (!json.success) {
          throw new Error(json.error || 'Generation failed');
        }

        const newTask = json.data;
        const id = (Math.floor(Math.random() * 900) + 200).toString();
        const taskObj = { ...newTask, id };
        setTasks(prev => [...prev, taskObj]);
        addLine(`New task [${id}] "${newTask.title}" registered to repository.`, 'success');
      } catch (err: any) {
        addLine(`Synthesis failed: ${err.message || 'Unknown error'}`, 'error');
      } finally {
        setIsProcessing(false);
      }
    } else {
      addLine(`Command not recognized: ${command}. Type 'help' for assistance.`, 'error');
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#050505] text-[#00ff41] p-4 overflow-hidden gap-4 flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-80 flex flex-col gap-4">
        <div className="p-4 border border-green-900/30 rounded-lg bg-black/40 shadow-xl">
          <div className="flex items-center gap-2 mb-4 border-b border-green-900/20 pb-2">
            <TerminalIcon className="text-green-500" size={20} />
            <h1 className="font-bold tracking-tighter text-white uppercase text-sm">Project Terminus</h1>
          </div>
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="opacity-60 uppercase">System Status</span>
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                NOMINAL
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60 uppercase">Registry Count</span>
              <span className="text-white">{tasks.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60 uppercase">Breakthroughs</span>
              <span className="text-white">12,402</span>
            </div>
          </div>
        </div>

        {/* Inspector */}
        <div className="flex-1 p-4 border border-green-900/30 rounded-lg bg-black/40 shadow-xl overflow-y-auto">
          <div className="flex items-center gap-2 mb-4 border-b border-green-900/20 pb-2">
            <Cpu className="text-yellow-500" size={20} />
            <h2 className="font-bold tracking-tighter text-white uppercase text-sm">Inspector</h2>
          </div>
          {analysis ? (
            <div className="space-y-4 font-mono text-xs">
              <div>
                <span className="text-yellow-500 uppercase block mb-1">Target Model</span>
                <p className="text-white border-l-2 border-yellow-500/30 pl-2">{analysis.model}</p>
              </div>
              <div>
                <span className="text-cyan-500 uppercase block mb-1">Reasoning Trace</span>
                <p className="text-green-400/80 italic border-l-2 border-cyan-500/30 pl-2">
                  "{analysis.reasoning.substring(0, 150)}..."
                </p>
              </div>
              <div>
                <span className="text-red-500 uppercase block mb-1">Failure Point</span>
                <p className="text-white bg-red-950/20 p-2 rounded border border-red-900/30">
                  {analysis.failurePoint}
                </p>
              </div>
              <button
                onClick={() => setAnalysis(null)}
                className="w-full py-2 bg-green-900/20 hover:bg-green-900/40 border border-green-900/50 rounded text-green-400 font-bold uppercase mt-4"
              >
                Clear Analysis
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-30">
              <Zap size={32} className="mb-2" />
              <p className="text-xs">Run 'tb run --task-id 101' to test</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Terminal */}
      <main className="flex-1 flex flex-col gap-4">
        <Terminal lines={lines} onCommand={handleCommand} isProcessing={isProcessing} />

        <footer className="h-8 flex items-center justify-between px-4 bg-black/80 border border-green-900/30 rounded-lg text-[10px] tracking-widest uppercase font-mono">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-green-500" />
              Secure Link: Active
            </span>
            <span className="flex items-center gap-2 hidden md:flex">
              <Bug size={14} className="text-red-500" />
              Latent Failures: Detected
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/40">PORTKEY-GW</span>
            <span className="text-white">API-KEY: REDACTED</span>
          </div>
        </footer>
      </main>

      {/* Code Overlay */}
      {analysis?.codeOutput && (
        <div className="fixed bottom-16 right-8 w-80 lg:w-96 max-h-[50vh] bg-black border border-green-500/30 rounded-lg shadow-2xl p-4 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-green-500/20 pb-2 mb-2">
            <span className="text-[10px] font-bold text-green-500">LLM_GENERATED_CODE</span>
            <Settings size={14} className="animate-spin opacity-50" />
          </div>
          <pre className="flex-1 overflow-y-auto text-[10px] text-white/80 font-mono">
            <code>{analysis.codeOutput}</code>
          </pre>
        </div>
      )}
    </div>
  );
}