export interface ChatImage {
  data: string; // base64
  mimeType: string;
  name?: string;
  size?: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  images?: ChatImage[];
  modelUsed?: string;
  thinkingLevel?: "HIGH" | "LOW" | "MINIMAL" | "OFF";
  isStreaming?: boolean;
  isError?: boolean;
  latencyMs?: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  thinkingLevel?: "HIGH" | "LOW" | "MINIMAL" | "OFF";
  createdAt: number;
  updatedAt: number;
}

export interface ModelDetail {
  id: string;
  name: string;
  tagline: string;
  tier: string;
  contextWindow: string;
  maxOutputTokens: string;
  modalities: string[];
  reasoning: string;
  speed: string;
  bestFor: string;
  strengths: string[];
  pricing: string;
  status: string;
  inputCostPer1M: number; // in USD
  outputCostPer1M: number; // in USD
  paidKeyRequired?: boolean;
}

export interface LearningTopic {
  id: string;
  title: string;
  icon: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  suggestedPrompt: string;
  category: "Architecture" | "Capabilities" | "SDK" | "Optimization";
  highlights: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type Theme = "dark" | "light" | "oled";
