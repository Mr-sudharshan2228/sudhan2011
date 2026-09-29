import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "15mb" }));

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// System instruction tailored for Google Gemini Model Learning Assistant
const GEMINI_MENTOR_SYSTEM_INSTRUCTION = `You are "GeminiGPT" — the premier interactive learning assistant, teacher, and architectural guide for Google's Gemini family of AI models.

Your core mission is to help developers, students, researchers, and engineers master Google Gemini models:
- Architecture, capabilities, and token economics across:
  * Gemini 3.8 Flash (General fast reasoning, high-throughput, multimodal 1M context)
  * Gemini 3.1 Pro (Flagship complex reasoning, coding, STEM, deep analysis)
  * Gemini 3.1 Flash-Lite (Cost-efficient, ultra-low latency, edge and high-volume tasks)
  * Gemini 3.8 Flash-TTS & Flash-Lite-TTS (Native audio generation, voice styling, screenplay dialogue)
  * Gemini 3.1 Flash-Image & Flash-Lite-Image (Multimodal image synthesis & editing)
  * Gemini 3.8 Live (Low-latency real-time voice & vision streaming)
  * Gemini 3.5 Transcribe & Transcribe-Live (Audio transcription)
  * Veo 3.1 & Veo 3.1 Lite (State of the art video generation)
  * Lyria 3 (Music clip and pro track generation)
- Technical SDK mastery (@google/genai TypeScript & Python SDKs):
  * Correct import: import { GoogleGenAI } from "@google/genai"; (never legacy GoogleGenerativeAI)
  * Server-side calling patterns and process.env.GEMINI_API_KEY security
  * Calling generateContent, generateContentStream, thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH | LOW | MINIMAL }
  * Structured JSON schema with Type (from "@google/genai") and responseMimeType: "application/json"
  * Function Calling (tools: [{ functionDeclarations: [...] }]) and combining with built-in tools like googleSearch
  * Grounding with Google Search and URL context
  * Context Caching for large datasets, books, codebases (1M - 2M tokens)
- Practical prompt engineering techniques specifically tuned for Gemini:
  * System instructions vs user turns
  * Multi-turn chats with ai.chats.create
  * Multimodal prompt composition (images, audio, video timestamps, PDF analysis)
  * Reducing hallucinations and benchmark comparisons (MMLU-Pro, HumanEval, MathVista).

Formatting style:
- Friendly, expert, structured ChatGPT-style responses.
- Use markdown tables for model comparisons.
- Provide clean, executable TypeScript/Python code blocks with proper comments.
- Include quick "Pro-Tips" and "Common Pitfalls" (e.g., deprecated models like gemini-1.5 or gemini-2.0, or avoiding client-side API key leaks).
- Keep code concise, modern, and directly usable.`;

// Comprehensive Gemini Models Directory
const GEMINI_MODELS_DATA = [
  {
    id: "gemini-3.8-flash",
    name: "Gemini 3.8 Flash",
    tagline: "High-speed flagship for everyday intelligence & multimodal reasoning",
    tier: "Standard / Free tier eligible",
    contextWindow: "1,048,576 tokens (~700k words)",
    maxOutputTokens: "8,192 tokens",
    modalities: ["Text", "Image", "Audio", "Video", "PDF"],
    reasoning: "Dynamic adaptive thinking (ThinkingLevel.LOW / HIGH)",
    speed: "Ultra-fast (< 400ms TTFT)",
    bestFor: "Production chat apps, customer support, real-time agent workflows, document extraction",
    strengths: ["1M context window", "Low latency", "High throughput", "Multimodal inputs"],
    pricing: "$0.075 / 1M input tokens (< 128k), $0.30 / 1M output tokens",
    status: "Active (Recommended Default)"
  },
  {
    id: "gemini-3.1-pro-preview",
    name: "Gemini 3.1 Pro Preview",
    tagline: "Google's most capable reasoning model for advanced coding and complex STEM",
    tier: "Paid API key required",
    contextWindow: "2,097,152 tokens (~1.5M words)",
    maxOutputTokens: "8,192 tokens",
    modalities: ["Text", "Code", "Images", "Audio", "Video"],
    reasoning: "Deep multi-step analytical reasoning and mathematical verification",
    speed: "Balanced reasoning throughput",
    bestFor: "Complex software architecture, advanced refactoring, scientific research, mathematical proofs",
    strengths: ["2M massive context window", "Top benchmark performance", "Complex tool-use pipelines"],
    pricing: "$1.25 / 1M input tokens (< 128k), $5.00 / 1M output tokens",
    status: "Pro Tier"
  },
  {
    id: "gemini-3.1-flash-lite",
    name: "Gemini 3.1 Flash-Lite",
    tagline: "Extreme efficiency and cost optimization for high-frequency tasks",
    tier: "Standard / Free tier eligible",
    contextWindow: "1,048,576 tokens",
    maxOutputTokens: "8,192 tokens",
    modalities: ["Text", "Multimodal"],
    reasoning: "ThinkingLevel.MINIMAL by default (low latency overhead)",
    speed: "Sub-250ms latency",
    bestFor: "High-throughput classification, moderation, light summarization, query routing",
    strengths: ["Lowest cost per token", "Instant response times", "High concurrency"],
    pricing: "$0.01875 / 1M input tokens, $0.075 / 1M output tokens",
    status: "Budget & Scale"
  },
  {
    id: "gemini-3.8-flash-lite-tts",
    name: "Gemini 3.8 Flash-Lite TTS",
    tagline: "High-throughput speech generation with native voices and emotional nuance",
    tier: "Standard / Free tier eligible",
    contextWindow: "Audio output stream",
    maxOutputTokens: "Real-time audio output",
    modalities: ["Text in -> Audio out (24kHz Mono WAV)"],
    reasoning: "Prosodic and emotional inflection modeling",
    speed: "Real-time speech synthesis",
    bestFor: "Article reading, accessibility, voice assistants, localized narration",
    strengths: ["Prebuilt voices (Puck, Charon, Kore, Fenrir, Zephyr)", "Direct WAV byte streaming"],
    pricing: "Cost per audio minute / standard rate",
    status: "Audio / TTS"
  },
  {
    id: "gemini-3.1-flash-image",
    name: "Gemini 3.1 Flash-Image (Nano Banana 2)",
    tagline: "High-fidelity native visual generation and image editing",
    tier: "Paid API key required",
    contextWindow: "Text + Image prompts",
    maxOutputTokens: "Up to 4K resolution images",
    modalities: ["Text + Reference Images -> High-res Images"],
    reasoning: "Spatial layout understanding and multi-turn visual manipulation",
    speed: "Fast image generation",
    bestFor: "Product mockups, UI concepts, illustrations, photo transformation with search grounding",
    strengths: ["Supports 512px, 1K, 2K, 4K", "Aspect ratios 1:1, 16:9, 9:16, 1:4, 4:1", "Google Image search integration"],
    pricing: "Per image generated",
    status: "Visual AI"
  },
  {
    id: "gemini-3.8-live",
    name: "Gemini 3.8 Live API",
    tagline: "Bidirectional real-time voice and vision conversational intelligence",
    tier: "Standard",
    contextWindow: "Continuous streaming session",
    maxOutputTokens: "Low-latency streaming audio/text",
    modalities: ["Audio (16kHz in, 24kHz out)", "Video frames", "Text"],
    reasoning: "Real-time conversational turn-taking & barge-in interruption detection",
    speed: "Human conversational latency (< 300ms round-trip)",
    bestFor: "Real-time voice bots, customer interviewers, hands-free field assistants",
    strengths: ["Interruption handling", "Live visual inspection", "WebSocket bridging"],
    pricing: "Live session rate",
    status: "Realtime Voice/Vision"
  }
];

// Endpoint: Models metadata
app.get("/api/models-info", (_req, res) => {
  res.json({
    models: GEMINI_MODELS_DATA,
    activeDefault: "gemini-3.8-flash",
    sdkVersion: "@google/genai ^2.4.0",
    hasApiKey: Boolean(apiKey)
  });
});

// Endpoint: Chat Stream (SSE)
app.post("/api/chat/stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendEvent = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const {
      messages,
      model = "gemini-3.8-flash",
      thinkingLevel,
      temperature = 0.7,
      systemInstruction
    } = req.body;

    if (!ai) {
      sendEvent({
        text: "⚠️ **Gemini API Key Missing**: The server environment variable `GEMINI_API_KEY` is not configured. Please ensure your API key is attached in your AI Studio project secrets or environment."
      });
      sendEvent({ done: true });
      res.end();
      return;
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      sendEvent({ error: "No messages provided." });
      sendEvent({ done: true });
      res.end();
      return;
    }

    // Format contents for @google/genai
    // Structure: array of { role: 'user' | 'model', parts: [...] }
    const contents: any[] = [];

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const role = msg.role === "assistant" || msg.role === "model" ? "model" : "user";
      const parts: any[] = [];

      // Multimodal attachments if present
      if (msg.images && Array.isArray(msg.images)) {
        for (const img of msg.images) {
          if (img.data && img.mimeType) {
            // Strip data:image/...;base64, prefix if included
            const cleanBase64 = img.data.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, "");
            parts.push({
              inlineData: {
                data: cleanBase64,
                mimeType: img.mimeType,
              },
            });
          }
        }
      }

      if (msg.content) {
        parts.push({ text: msg.content });
      }

      if (parts.length > 0) {
        contents.push({ role, parts });
      }
    }

    const config: any = {
      systemInstruction: systemInstruction || GEMINI_MENTOR_SYSTEM_INSTRUCTION,
      temperature: typeof temperature === "number" ? temperature : 0.7,
    };

    // Configure thinkingLevel if specified and supported (Gemini 3 series)
    if (thinkingLevel) {
      if (thinkingLevel === "HIGH") {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      } else if (thinkingLevel === "LOW") {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
      } else if (thinkingLevel === "MINIMAL") {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.MINIMAL };
      }
    }

    // Request stream from @google/genai
    const stream = await ai.models.generateContentStream({
      model: model || "gemini-3.8-flash",
      contents,
      config,
    });

    for await (const chunk of stream) {
      if (chunk.text) {
        sendEvent({ text: chunk.text });
      }
    }

    sendEvent({ done: true });
    res.end();
  } catch (error: any) {
    console.error("Gemini stream error:", error);
    sendEvent({
      error: error?.message || "Failed to generate response from Gemini API.",
      done: true,
    });
    res.end();
  }
});

// Endpoint: Generate interactive quiz questions on Gemini models
app.post("/api/quiz", async (req, res) => {
  try {
    const { topic = "Gemini Models Architecture and Features" } = req.body;
    if (!ai) {
      return res.status(503).json({ error: "Gemini API key is not configured on server." });
    }

    const prompt = `Generate 4 engaging, multiple-choice questions to test a developer's knowledge about Google Gemini models (e.g. Gemini 3.8 Flash, 3.1 Pro, context windows, thinking levels, @google/genai SDK, multimodal features, tool use). Topic focus: ${topic}.
Respond with ONLY valid JSON adhering strictly to this schema:
{
  "title": "Gemini Models Mastery Quiz",
  "questions": [
    {
      "id": "q1",
      "question": "question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Detailed explanation of why this is correct and what Gemini feature it relates to"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("Quiz generation error:", err);
    res.status(500).json({ error: err?.message || "Failed to generate quiz." });
  }
});

// Setup Vite middleware in dev or static server in prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
