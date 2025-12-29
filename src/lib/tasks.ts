// src/lib/tasks.ts
export interface Task {
    id: string;
    title: string;
    category: 'Python' | 'Docker' | 'CLI';
    description: string;
    craftedPrompt: string; // Prompt to feed to LLM, designed for failure
    expectedChallenges: string[]; // Why LLMs might fail
}

export const tasks: Task[] = [
    {
        id: 'python-race-condition',
        title: 'Python Concurrency with Race Condition',
        category: 'Python',
        description: 'Write a Python script that simulates a bank account with multiple threads depositing/withdrawing. Run it in terminal with `python script.py`. The task should expose race conditions if not handled properly.',
        craftedPrompt: 'Create a simple Python program for a shared bank account where 10 threads each deposit $10 and withdraw $5 randomly. Use threading module but don\'t mention locks explicitly. Make it output the final balance after all operations. What could go wrong if run multiple times?',
        expectedChallenges: [
            'LLMs often forget to suggest locks, leading to inconsistent balances.',
            'Hallucinate incorrect final values due to not simulating runs.',
            'Omit import statements or thread joining.'
        ]
    },
    {
        id: 'docker-multi-stage',
        title: 'Docker Multi-Stage Build with Secrets',
        category: 'Docker',
        description: 'Build a Docker image using multi-stage builds that handles build-time secrets. Test with `docker build --secret id=mysecret,src=.env .` and run the container.',
        craftedPrompt: 'Write a Dockerfile for a Node.js app that copies a secret file during build but ensures it\'s not in the final image. Use multi-stage and assume a .env file with API_KEY. How to build and run it without exposing the secret?',
        expectedChallenges: [
            'LLMs might leak secrets in the final layer by misunderstanding stages.',
            'Forget --secret flag in build command.',
            'Hallucinate deprecated syntax like BUILDKIT.'
        ]
    },
    {
        id: 'cli-pipe-redirect',
        title: 'CLI Piping with Error Handling',
        category: 'CLI',
        description: 'Create a bash script that pipes output from `ls` to `grep`, redirects errors to a file, and handles non-existent directories. Run with `./script.sh`.',
        craftedPrompt: 'Make a one-liner bash command that lists files in /nonexistent, pipes to grep for ".txt", redirects stdout to output.txt and stderr to error.log, but only if the directory exists. What if it doesn\'t?',
        expectedChallenges: [
            'LLMs often ignore conditional checks, causing silent failures.',
            'Misuse redirection (e.g., 2>&1 incorrectly).',
            'Hallucinate flags that don\'t exist in standard bash.'
        ]
    },
    // Add more tasks as needed, e.g., 5-10 total for variety
];