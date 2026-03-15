# Get Into the AI Ecosystem — $0 First, Pay When It Pays Off

A practical guide for a JavaScript full-stack engineer. **Goal:** Learn by building without spending money. Pay only when the ROI is clear.

---

## Tier 0: Truly free (no card, no expiry)

Use these first. No signup cost, no credit card, no “trial expiry” anxiety.

### 1. **Ollama (local LLMs) — $0 forever**

- **What:** Run open models (Llama, Mistral, Phi, etc.) on your Mac/PC. No API key, no network after download.
- **Why for you:** Same patterns as cloud APIs (prompts, streaming, tool use). Your code stays the same when you switch to OpenAI/Anthropic later.
- **How (JS):**
  - Install [Ollama](https://ollama.com), then e.g. `ollama pull llama3.2` or `ollama pull phi3`.
  - Use **Vercel AI SDK** with a community Ollama provider so your app code is provider-agnostic:
    - `ollama-ai-provider` or `ai-sdk-ollama` (see [Vercel AI SDK – Ollama](https://sdk.vercel.ai/providers/community-providers/ollama)).
  - Or use the official **ollama** npm package / REST API at `http://localhost:11434`.
- **Catch:** Needs a decent machine (8GB+ RAM for smaller models). Good for learning; production would be cloud.

### 2. **Google AI Studio (Gemini API) — free, no credit card**

- **What:** Gemini 2.5 Pro / Flash / Flash-Lite via API. Free tier, no card required (in eligible regions).
- **Limits (free):** ~5–15 RPM, ~250K TPM, 1M context. Resets daily (midnight PT).
- **How:** [aistudio.google.com](https://aistudio.google.com) → Create API key → use with `@ai-sdk/google` or Google’s SDK. Same `streamText` / `useChat` patterns as other providers.
- **Why:** Real cloud API, rate limits teach you to handle throttling and retries. Great for small projects and learning.

### 3. **Groq — free tier, no credit card**

- **What:** Very fast inference (e.g. Llama 3.3 70B). OpenAI-compatible API.
- **Free quota:** ~14.4K requests/day, large token limits. Sign up at [console.groq.com](https://console.groq.com).
- **How:** Use as an OpenAI-compatible endpoint (base URL + API key) with `openai` SDK or Vercel AI SDK’s OpenAI-compatible provider. Same code as OpenAI, different base URL.

**Summary:**  
Ollama = local, $0 forever.  
Google AI Studio = cloud, $0, no card.  
Groq = cloud, $0, no card, very fast.  
Use these three and you can learn the whole stack without paying.

---

## Tier 1: Free credits (one-time; card may be required)

Use after you’re comfortable with Tier 0. Don’t burn these on “hello world”; use them for slightly bigger experiments.

| Provider        | Free credits | Expiry   | Notes                                      |
|----------------|-------------|----------|--------------------------------------------|
| **OpenAI**     | $5          | 3 months | New account; often GPT-3.5 only on free tier, 3 RPM. |
| **Anthropic**  | $5          | 30 days  | Claude Haiku/Sonnet/Opus (rate limited).   |
| **Google Cloud** | $300     | 90 days  | Vertex AI (Gemini + Claude). New GCP account. |

- **OpenAI:** Good for learning the “industry default” (function calling, structured outputs). Use for one serious project once you’ve designed it.
- **Anthropic:** Strong for long context and tool use. Use when you want to try Claude-specific behavior.
- **Google Cloud $300:** Best “bang for buck” if you’re okay with GCP. Use for a small production-style app or a portfolio project.

**Tip:** Create accounts when you’re ready to run a real project, not on day one. That way credits don’t expire while you’re still in “tutorial mode.”

---

## What to build (in order) — all doable at $0

1. **Chat UI with streaming (Ollama or Gemini)**  
   - Next.js or React + Fastify/Express.  
   - Backend: one route that streams (e.g. Vercel AI SDK `streamText` or provider streaming).  
   - Frontend: `useChat` or a simple stream reader.  
   - **Learn:** Streaming, message list, basic error handling.

2. **Same app, swap provider**  
   - Keep the same UI and backend interface; switch from Ollama to Gemini or Groq by changing env (e.g. `AI_PROVIDER`, `API_KEY`, base URL).  
   - **Learn:** Provider-agnostic design, env-based config.

3. **Tool/function calling**  
   - One or two tools (e.g. “get weather”, “search”).  
   - Backend: define tools, pass to the model, handle `tool_calls`, call your functions, send results back.  
   - **Learn:** Tool schema, multi-step turns, validation (e.g. Zod).

4. **Structured output**  
   - e.g. “Return a JSON object with fields X, Y, Z.” Use provider structured output or Zod + retry.  
   - **Learn:** Type-safe AI responses, validation, retries.

5. **Small “agent” flow**  
   - One agent that can use 2–3 tools and do a few steps (e.g. “find a repo, summarize README”).  
   - **Learn:** Prompting, tool choice, error handling. You can do this with Ollama (if the model supports tools) or Gemini/Groq.

All of this can be done with **Ollama + Gemini + Groq** and $0. Use credits (OpenAI/Anthropic/GCP) when you want to compare models or build something for your portfolio.

---

## Tech stack that keeps you free and portable

- **Runtime:** Node 20+ (you already use this).
- **Backend:** Fastify or Express; one or two routes for chat and tools.
- **AI layer:** **Vercel AI SDK** (`ai`, `@ai-sdk/google`, optional `ollama-ai-provider`). One abstraction; swap providers via config.
- **Frontend:** React `useChat` (or similar) against your backend; same code for any provider.
- **Local:** Ollama + a small model (e.g. `llama3.2`, `phi3`) so you can code without hitting rate limits.

No need for LangChain/LangGraph at the start. Add them when you hit limits (complex multi-agent flows, durable execution).

---

## When paying actually has ROI

Consider spending a little when:

- **You’re building something real:** A small product, a portfolio piece, or a client prototype. Then $20–50/month (OpenAI or Anthropic) is often enough and pays off in credibility and learning.
- **You need higher limits:** Free tiers throttle you (RPM/RPD). Paid tiers unlock smoother demos and real usage.
- **You want the best models:** GPT-4.1 / Claude Opus for complex reasoning or long context. Use sparingly (e.g. only for the “brain” of an agent, not for every message).
- **You’re applying for roles:** A few dollars to run a clean demo (e.g. on Vercel + OpenAI) can be worth it for interviews.

**ROI rule:** If it’s learning only → stay on Tier 0. If it’s a project you’ll show or ship → Tier 1 credits first, then small paid usage when credits run out.

---

## Quick start (today, $0)

1. Install Ollama, pull `phi3` or `llama3.2`.
2. Create a Google AI Studio API key (no card).
3. In your repo: `npm i ai @ai-sdk/google` (and optionally `ollama-ai-provider`).
4. Add one streaming chat route (e.g. with `streamText` and Gemini or Ollama).
5. Add a minimal React form + stream reader or `useChat` to that route.

You’ll have touched: cloud API, local API, streaming, and provider-agnostic design. From there, add tools and structured output; then move to credits/paid when you have a concrete project.

---

## Summary

| Goal                         | Use                          | Cost   |
|-----------------------------|------------------------------|--------|
| Learn basics, no pressure   | Ollama + Gemini + Groq       | $0     |
| Practice “real” API limits  | Gemini / Groq free tier      | $0     |
| One serious project         | OpenAI/Anthropic $5 or GCP $300 | Free credits |
| Portfolio / interview demo | Small paid usage if needed   | ~$20–50 once |

You can put your foot firmly in the AI ecosystem without spending a penny. Pay only when the project is worth it and the ROI is clear.
