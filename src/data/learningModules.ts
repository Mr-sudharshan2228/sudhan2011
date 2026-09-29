import { LearningTopic, ModelDetail } from "../types";

export const GEMINI_MODELS_DATA: ModelDetail[] = [
  {
    id: "gemini-3.8-flash",
    name: "Gemini 3.8 Flash",
    tagline: "High-speed flagship for everyday intelligence & multimodal reasoning",
    tier: "Standard / Free tier eligible",
    contextWindow: "1,048,576 tokens (~700,000 words)",
    maxOutputTokens: "8,192 tokens",
    modalities: ["Text", "Image", "Audio", "Video", "PDF / Code"],
    reasoning: "Adaptive Dynamic Thinking (ThinkingLevel.LOW / HIGH)",
    speed: "Ultra-fast (< 400ms TTFT)",
    bestFor: "Production chat apps, real-time agent workflows, document extraction, customer assistance",
    strengths: ["1M context window", "Low latency", "High throughput", "Multimodal inputs"],
    pricing: "$0.075 / 1M input tokens (<128k), $0.30 / 1M output tokens",
    status: "Active (Recommended Default)",
    inputCostPer1M: 0.075,
    outputCostPer1M: 0.30,
    paidKeyRequired: false
  },
  {
    id: "gemini-3.1-pro-preview",
    name: "Gemini 3.1 Pro Preview",
    tagline: "Google's most capable reasoning model for advanced coding and complex STEM",
    tier: "Paid API key required",
    contextWindow: "2,097,152 tokens (~1,500,000 words)",
    maxOutputTokens: "8,192 tokens",
    modalities: ["Text", "Code", "Images", "Audio", "Video"],
    reasoning: "Deep multi-step analytical reasoning and mathematical verification",
    speed: "Balanced reasoning throughput",
    bestFor: "Complex software architecture, advanced refactoring, scientific research, mathematical proofs",
    strengths: ["2M massive context window", "Top benchmark performance", "Complex tool-use pipelines"],
    pricing: "$1.25 / 1M input tokens (<128k), $5.00 / 1M output tokens",
    status: "Pro Tier",
    inputCostPer1M: 1.25,
    outputCostPer1M: 5.00,
    paidKeyRequired: true
  },
  {
    id: "gemini-3.1-flash-lite",
    name: "Gemini 3.1 Flash-Lite",
    tagline: "Extreme efficiency and cost optimization for high-frequency tasks",
    tier: "Standard / Free tier eligible",
    contextWindow: "1,048,576 tokens (~700,000 words)",
    maxOutputTokens: "8,192 tokens",
    modalities: ["Text", "Multimodal"],
    reasoning: "ThinkingLevel.MINIMAL by default (low latency overhead)",
    speed: "Sub-250ms latency",
    bestFor: "High-throughput classification, moderation, light summarization, query routing",
    strengths: ["Lowest cost per token", "Instant response times", "High concurrency"],
    pricing: "$0.01875 / 1M input tokens, $0.075 / 1M output tokens",
    status: "Budget & Scale",
    inputCostPer1M: 0.01875,
    outputCostPer1M: 0.075,
    paidKeyRequired: false
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
    pricing: "Standard audio rate",
    status: "Audio / TTS",
    inputCostPer1M: 0.075,
    outputCostPer1M: 0.30,
    paidKeyRequired: false
  },
  {
    id: "gemini-3.1-flash-image",
    name: "Gemini 3.1 Flash-Image",
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
    status: "Visual AI",
    inputCostPer1M: 0.20,
    outputCostPer1M: 0.80,
    paidKeyRequired: true
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
    status: "Realtime Voice/Vision",
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.60,
    paidKeyRequired: false
  }
];

export const LEARNING_TOPICS: LearningTopic[] = [
  {
    id: "models-overview",
    title: "Gemini 3 Family Comparison",
    icon: "Layers",
    description: "Understand the core trade-offs between Flash, Pro, and Flash-Lite for latency, intelligence, and price.",
    difficulty: "Beginner",
    category: "Architecture",
    suggestedPrompt: "Can you provide a comprehensive comparison between Gemini 3.8 Flash, Gemini 3.1 Pro, and Gemini 3.1 Flash-Lite? Include a markdown table covering context window, latency, cost per 1M tokens, reasoning ability, and when to pick each one.",
    highlights: ["1M vs 2M context windows", "Cost trade-offs", "Speed benchmarks"]
  },
  {
    id: "thinking-levels",
    title: "Thinking & Reasoning Levels",
    icon: "Brain",
    description: "Master Gemini 3's adaptive reasoning: ThinkingLevel.HIGH, LOW, and MINIMAL token behaviors.",
    difficulty: "Intermediate",
    category: "Capabilities",
    suggestedPrompt: "Explain how Gemini 3's thinking levels work in the @google/genai SDK. What is the difference between ThinkingLevel.HIGH, ThinkingLevel.LOW, and ThinkingLevel.MINIMAL? Provide a practical TypeScript code example showing how to configure it.",
    highlights: ["Chain-of-thought tokens", "Latency control", "Verification"]
  },
  {
    id: "context-window",
    title: "1M & 2M Context Windows",
    icon: "Maximize2",
    description: "Learn how to feed entire codebases, 1,000-page books, or hours of audio into Gemini's massive context.",
    difficulty: "Intermediate",
    category: "Architecture",
    suggestedPrompt: "How does Gemini achieve 1 Million and 2 Million token context windows? How can I analyze an entire GitHub repository or long video file without running out of tokens? What is Context Caching and when should I use it?",
    highlights: ["Needle-in-a-haystack retrieval", "Context caching", "Cost reduction"]
  },
  {
    id: "multimodal-vision",
    title: "Multimodal Processing",
    icon: "Image",
    description: "Analyze images, video frames, audio clips, and PDFs natively with interleaved prompt tokens.",
    difficulty: "Intermediate",
    category: "Capabilities",
    suggestedPrompt: "Show me how Gemini processes multimodal inputs like images, PDFs, and video timestamps. Provide a complete TypeScript example using @google/genai to pass an image base64 inlineData alongside a text prompt.",
    highlights: ["Native tokenization", "Video timestamp QA", "Document extraction"]
  },
  {
    id: "function-calling",
    title: "Function Calling & Structured JSON",
    icon: "Terminal",
    description: "Connect Gemini to databases, external APIs, and return strictly typed JSON with Type schemas.",
    difficulty: "Advanced",
    category: "SDK",
    suggestedPrompt: "Walk me through how to implement Function Calling and Structured JSON Output using @google/genai. Show the exact schema definition using the Type enum from @google/genai, and how to execute tools in a multi-turn conversation loop.",
    highlights: ["Type enum from @google/genai", "Tool execution loop", "Zero hallucination schema"]
  },
  {
    id: "search-grounding",
    title: "Google Search & Maps Grounding",
    icon: "Compass",
    description: "Anchor Gemini responses in real-time web facts and Google Maps places with zero extra setup.",
    difficulty: "Intermediate",
    category: "Capabilities",
    suggestedPrompt: "How do I enable Google Search Grounding and Google Maps Grounding with Gemini 3 models using @google/genai? Provide an example of how search citations and web metadata are returned.",
    highlights: ["Real-time data", "Automatic citation sources", "Tool hybrid mode"]
  },
  {
    id: "audio-tts-live",
    title: "Speech & Live API",
    icon: "Mic",
    description: "Generate natural spoken WAV audio with prebuilt voices, or build real-time bi-directional voice agents.",
    difficulty: "Advanced",
    category: "Capabilities",
    suggestedPrompt: "What are the options for generating voice and real-time audio with Gemini? Explain the difference between gemini-3.8-flash-lite-tts and the Gemini 3.8 Live API, with sample code for generating a 24kHz WAV speech file.",
    highlights: ["Puck, Kore, Zephyr voices", "WebSocket bi-directional Live API", "Barge-in detection"]
  },
  {
    id: "sdk-best-practices",
    title: "Modern @google/genai SDK Guide",
    icon: "Code",
    description: "Avoid deprecated libraries and master the modern server-side genai SDK patterns.",
    difficulty: "Beginner",
    category: "SDK",
    suggestedPrompt: "What are the most common mistakes developers make when integrating Gemini, like using deprecated GoogleGenerativeAI packages or exposing API keys on the client? Provide the gold standard server-side TypeScript architecture.",
    highlights: ["Deprecated package alerts", "Secure proxy patterns", "Stream handling"]
  }
];

export const PRESET_STARTER_PROMPTS = [
  {
    title: "Flash vs Pro vs Lite",
    subtitle: "When to choose which model",
    prompt: "Compare Gemini 3.8 Flash, Gemini 3.1 Pro, and Gemini 3.1 Flash-Lite with a clear trade-off decision framework."
  },
  {
    title: "Structured JSON Output",
    subtitle: "Using Type enum from @google/genai",
    prompt: "Show me how to extract structured data as JSON using the Type enum with Gemini 3.8 Flash in TypeScript."
  },
  {
    title: "Thinking Level Control",
    subtitle: "Optimize latency vs reasoning depth",
    prompt: "How do I configure ThinkingLevel (HIGH, LOW, MINIMAL) in Gemini 3, and when does each level make sense?"
  },
  {
    title: "Search Grounding Example",
    subtitle: "Connect Gemini to real-time Google search",
    prompt: "Write a working Node.js server snippet using @google/genai that enables Google Search grounding on Gemini 3.8 Flash."
  }
];

export const STATIC_QUIZ_QUESTIONS = [
  {
    id: "q1",
    question: "Which package is the modern, official Google Gen AI TypeScript SDK recommended for Gemini 3 series models?",
    options: [
      "@google/generative-ai",
      "@google/genai",
      "google-ai-studio-sdk",
      "gemini-ai"
    ],
    correctIndex: 1,
    explanation: "@google/genai is the current unified SDK from Google. Packages like @google/generative-ai are legacy."
  },
  {
    id: "q2",
    question: "What is the maximum context window of Gemini 3.1 Pro Preview?",
    options: [
      "128,000 tokens",
      "1,048,576 tokens (~1M)",
      "2,097,152 tokens (~2M)",
      "10,000,000 tokens"
    ],
    correctIndex: 2,
    explanation: "Gemini 3.1 Pro Preview features an industry-leading 2,097,152 token (~2 Million) context window, capable of analyzing massive codebases and long video hours."
  },
  {
    id: "q3",
    question: "Where should your GEMINI_API_KEY be placed in a web application according to security best practices?",
    options: [
      "In the client-side JavaScript bundle using window.GEMINI_KEY",
      "In an HTML meta tag on the index page",
      "Exclusively in server-side environment variables accessed via process.env.GEMINI_API_KEY",
      "Hardcoded inside React component state"
    ],
    correctIndex: 2,
    explanation: "API keys must never be exposed to the browser. Calls should always be executed on the server via proxy endpoints."
  },
  {
    id: "q4",
    question: "Which ThinkingLevel is configured by default for 'gemini-3.1-flash-lite' to guarantee minimal latency overhead?",
    options: [
      "ThinkingLevel.HIGH",
      "ThinkingLevel.MAXIMUM",
      "ThinkingLevel.LOW",
      "ThinkingLevel.MINIMAL"
    ],
    correctIndex: 3,
    explanation: "Gemini 3.1 Flash-Lite defaults to ThinkingLevel.MINIMAL to ensure rapid, sub-250ms throughput for high-frequency tasks."
  }
];
