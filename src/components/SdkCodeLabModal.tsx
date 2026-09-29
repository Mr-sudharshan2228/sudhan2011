import React, { useState } from "react";
import { X, Copy, Check, Code2, Sparkles, Terminal, FileCode, ArrowRight } from "lucide-react";

interface SdkCodeLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAssistant: (codePrompt: string) => void;
}

type CodeFeature =
  | "basic"
  | "stream"
  | "thinking"
  | "structured-json"
  | "function-calling"
  | "search-grounding"
  | "multimodal-image"
  | "tts-audio";

export const SdkCodeLabModal: React.FC<SdkCodeLabModalProps> = ({
  isOpen,
  onClose,
  onAskAssistant,
}) => {
  const [selectedFeature, setSelectedFeature] = useState<CodeFeature>("basic");
  const [selectedLang, setSelectedLang] = useState<"ts" | "py" | "curl">("ts");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const features: { id: CodeFeature; title: string; desc: string; model: string }[] = [
    {
      id: "basic",
      title: "Basic Content Generation",
      desc: "Standard server-side generateContent pattern",
      model: "gemini-3.8-flash"
    },
    {
      id: "stream",
      title: "Real-time Streaming (SSE)",
      desc: "Generate content chunk by chunk with async iterator",
      model: "gemini-3.8-flash"
    },
    {
      id: "thinking",
      title: "Thinking Levels Config",
      desc: "Configure reasoning depth (HIGH, LOW, MINIMAL)",
      model: "gemini-3.8-flash"
    },
    {
      id: "structured-json",
      title: "Structured Output (Type Enum)",
      desc: "Zero-hallucination JSON schema using Type from @google/genai",
      model: "gemini-3.8-flash"
    },
    {
      id: "function-calling",
      title: "Function Calling & Tools",
      desc: "Give Gemini tools to fetch data or execute backend actions",
      model: "gemini-3.8-flash"
    },
    {
      id: "search-grounding",
      title: "Google Search Grounding",
      desc: "Ground answers in live Google web search with citations",
      model: "gemini-3.8-flash"
    },
    {
      id: "multimodal-image",
      title: "Multimodal Image Input",
      desc: "Send base64 inlineData with text prompt",
      model: "gemini-3.8-flash"
    },
    {
      id: "tts-audio",
      title: "Text-to-Speech (WAV Audio)",
      desc: "Synthesize 24kHz studio voice audio clips with Puck/Kore",
      model: "gemini-3.8-flash-lite-tts"
    }
  ];

  const getCodeSnippet = (): string => {
    switch (selectedFeature) {
      case "basic":
        if (selectedLang === "ts") {
          return `import { GoogleGenAI } from "@google/genai";

// Initialize on server side using process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: { 'User-Agent': 'aistudio-build' }
  }
});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: "Explain the architecture of Gemini in 3 concise bullet points.",
    config: {
      temperature: 0.7,
      systemInstruction: "You are a senior Google Cloud AI educator."
    }
  });

  // Directly access .text getter (never call response.text())
  console.log(response.text);
}

main();`;
        } else if (selectedLang === "py") {
          return `from google import genai
from google.genai import types
import os

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

response = client.models.generate_content(
    model="gemini-3.8-flash",
    contents="Explain the architecture of Gemini in 3 concise bullet points.",
    config=types.GenerateContentConfig(
        temperature=0.7,
        system_instruction="You are a senior Google Cloud AI educator."
    )
)

print(response.text)`;
        } else {
          return `curl https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=$GEMINI_API_KEY \\
  -H 'Content-Type: application/json' \\
  -X POST \\
  -d '{
    "contents": [{
      "parts":[{"text": "Explain the architecture of Gemini in 3 concise bullet points."}]
    }]
  }'`;
        }

      case "stream":
        if (selectedLang === "ts") {
          return `import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function streamResponse() {
  const responseStream = await ai.models.generateContentStream({
    model: "gemini-3.8-flash",
    contents: "Write a high-performance Express server snippet in TypeScript.",
  });

  for await (const chunk of responseStream) {
    // chunk.text contains the incremental token output
    process.stdout.write(chunk.text || "");
  }
}

streamResponse();`;
        } else if (selectedLang === "py") {
          return `from google import genai
import os

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

response = client.models.generate_content_stream(
    model="gemini-3.8-flash",
    contents="Write a high-performance Express server snippet in TypeScript."
)

for chunk in response:
    print(chunk.text, end="")`;
        } else {
          return `# Server-Sent Events (SSE) streaming endpoint
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:streamGenerateContent?alt=sse&key=$GEMINI_API_KEY" \\
  -H 'Content-Type: application/json' \\
  -X POST \\
  -d '{
    "contents": [{"parts":[{"text": "Stream response test"}]}]
  }'`;
        }

      case "thinking":
        if (selectedLang === "ts") {
          return `import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function testReasoning() {
  // ThinkingLevel is only supported on Gemini 3 series models
  // Options: ThinkingLevel.HIGH (deep reasoning), LOW (fast reasoning), MINIMAL (minimal overhead)
  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: "Analyze this logic puzzle: If three cats catch three mice in three minutes, how many cats are needed to catch 100 mice in 100 minutes?",
    config: {
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.HIGH,
      }
    }
  });

  console.log(response.text);
}

testReasoning();`;
        } else {
          return `from google import genai
from google.genai import types
import os

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

response = client.models.generate_content(
    model="gemini-3.8-flash",
    contents="Solve the 3 cats 3 mice puzzle with step by step reasoning.",
    config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(
            thinking_level="HIGH"  # HIGH, LOW, or MINIMAL
        )
    )
)

print(response.text)`;
        }

      case "structured-json":
        return `import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function extractUserData() {
  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: "User: Sarah Connor, 34 years old, Cyberdyne systems researcher in LA.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          age: { type: Type.INTEGER },
          occupation: { type: Type.STRING },
          city: { type: Type.STRING },
          skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["name", "age", "occupation"]
      }
    }
  });

  const parsed = JSON.parse(response.text || "{}");
  console.log("Guaranteed Valid Schema:", parsed);
}

extractUserData();`;

      case "function-calling":
        return `import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 1. Declare tool
const checkInventory: FunctionDeclaration = {
  name: "checkInventory",
  description: "Check current warehouse stock for an SKU or item",
  parameters: {
    type: Type.OBJECT,
    properties: {
      itemSku: { type: Type.STRING, description: "e.g. SKU-9002" },
      warehouseLocation: { type: Type.STRING, description: "e.g. US-WEST" }
    },
    required: ["itemSku"]
  }
};

// 2. Call model with tools
const response = await ai.models.generateContent({
  model: "gemini-3.8-flash",
  contents: "Do we have any SKU-9002 units left in the US-WEST warehouse?",
  config: {
    tools: [{ functionDeclarations: [checkInventory] }]
  }
});

// 3. Inspect function call invocation
if (response.functionCalls && response.functionCalls.length > 0) {
  const call = response.functionCalls[0];
  console.log("Model requested tool invocation:", call.name, call.args);
}`;

      case "search-grounding":
        return `import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function searchGroundedQuery() {
  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: "What were the latest major updates announced for Google Gemini this week?",
    config: {
      tools: [
        { googleSearch: {} } // Seamless Google Search grounding
      ]
    }
  });

  console.log("Grounded text response:", response.text);
  // Grounding metadata containing sources, citations, and URLs
  const searchChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  console.log("Sources cited:", searchChunks);
}

searchGroundedQuery();`;

      case "multimodal-image":
        return `import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyzeImage() {
  const imageBase64 = fs.readFileSync("architecture-diagram.png", { encoding: "base64" });

  const imagePart = {
    inlineData: {
      mimeType: "image/png",
      data: imageBase64
    }
  };

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: [
      imagePart,
      { text: "Identify any performance bottlenecks or single points of failure in this system architecture." }
    ]
  });

  console.log(response.text);
}

analyzeImage();`;

      case "tts-audio":
        return `import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateVoice() {
  // Use gemini-3.8-flash-lite-tts for high throughput studio speech
  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash-lite-tts",
    contents: [{
      role: "user",
      parts: [{
        text: "Welcome to Google Gemini. Today we are exploring multimodal artificial intelligence.",
        speechMetadata: { style: "Calm, clear technology narrator" }
      }]
    }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          // Prebuilt voices: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
          prebuiltVoiceConfig: { voiceName: "Zephyr" }
        }
      }
    }
  });

  // Returns complete 24kHz mono 16-bit WAV file in base64
  const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (audioData) {
    fs.writeFileSync("output.wav", Buffer.from(audioData, "base64"));
    console.log("Generated 24kHz WAV audio: output.wav");
  }
}

generateVoice();`;

      default:
        return "";
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentFeature = features.find((f) => f.id === selectedFeature)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-neutral-900 border border-neutral-750 rounded-2xl shadow-2xl overflow-hidden text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-800 bg-neutral-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                @google/genai SDK Code Lab
              </h2>
              <p className="text-xs text-neutral-400">
                Production-ready code patterns for Gemini 3 models
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left Feature Selector */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-neutral-800 p-2.5 overflow-y-auto space-y-1 bg-neutral-950/40">
            <div className="px-2 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Gemini Capabilities
            </div>
            {features.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFeature(f.id)}
                className={`w-full text-left p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                  selectedFeature === f.id
                    ? "bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60"
                }`}
              >
                <div className="font-medium truncate">{f.title}</div>
                <div className="text-[10px] text-neutral-400 truncate mt-0.5">{f.desc}</div>
              </button>
            ))}
          </div>

          {/* Right Code Display */}
          <div className="flex-1 flex flex-col overflow-hidden bg-neutral-950">
            {/* Toolbar */}
            <div className="p-3 border-b border-neutral-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-neutral-400 font-mono">Model:</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[11px] font-mono border border-blue-500/30">
                  {currentFeature.model}
                </span>

                <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-0.5 ml-2">
                  <button
                    onClick={() => setSelectedLang("ts")}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      selectedLang === "ts" ? "bg-blue-600 text-white" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    TypeScript
                  </button>
                  <button
                    onClick={() => setSelectedLang("py")}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      selectedLang === "py" ? "bg-blue-600 text-white" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Python
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-neutral-200 text-xs font-medium border border-neutral-700 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onAskAssistant(
                      `Can you explain this ${selectedLang.toUpperCase()} implementation of ${currentFeature.title} using @google/genai? Here is the snippet:\n\n\`\`\`${selectedLang}\n${getCodeSnippet()}\n\`\`\`\nWhat are the key best practices and pitfalls to watch out for?`
                    );
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask Assistant About This</span>
                </button>
              </div>
            </div>

            {/* Code Pre container */}
            <div className="flex-1 overflow-auto p-4 text-xs font-mono text-neutral-200 leading-relaxed">
              <pre className="selection:bg-blue-500/30">
                <code>{getCodeSnippet()}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
