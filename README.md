# 💻 Project Terminus

**Project Terminus** is a research-driven framework for designing **terminal-based coding tasks that intentionally cause Large Language Model (LLM) failures**. The project focuses on exposing weaknesses in reasoning, tool usage, environment assumptions, and execution fidelity by crafting adversarial, real-world CLI scenarios.

The goal is not to “trick” models for novelty, but to **systematically evaluate and improve robustness** in coding agents, automation pipelines, and AI-assisted development workflows.

---

## 🧠 Core Objectives

- Design terminal-based coding challenges that surface LLM failure modes
- Stress-test reasoning across:
  - Environment setup
  - Dependency resolution
  - File system assumptions
  - Stateful CLI workflows
- Build reusable, customizable task templates for evaluation and experimentation
- Enable reproducible failure cases using Dockerized environments

---

## 🧪 What Makes These Tasks Hard

Project Terminus tasks are intentionally designed to break common LLM assumptions, including:

- Incomplete or misleading CLI output
- Non-standard directory structures
- Hidden environment constraints
- Multi-step commands with state dependency
- Ambiguous success conditions
- Tooling mismatches (Python versioning, shell differences, missing binaries)
