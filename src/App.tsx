/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "./components/Sidebar";
import { ChatArea } from "./components/ChatArea";
import { ModelComparisonModal } from "./components/ModelComparisonModal";
import { SdkCodeLabModal } from "./components/SdkCodeLabModal";
import { QuizModal } from "./components/QuizModal";
import { SettingsModal } from "./components/SettingsModal";
import { Conversation, Message, ChatImage, Theme } from "./types";
import { GEMINI_MODELS_DATA } from "./data/learningModules";

const LOCAL_STORAGE_KEY = "gemini_gpt_conversations";
const LOCAL_SETTINGS_KEY = "gemini_gpt_settings";

const DEFAULT_SYSTEM_PROMPT = `You are "GeminiGPT" — the premier interactive learning assistant, teacher, and architectural guide for Google's Gemini family of AI models.
Provide deep, expert, clear responses explaining Gemini models, tokens, thinking levels, multimodal features, and @google/genai SDK code patterns.`;

const INITIAL_CONVERSATION: Conversation = {
  id: "welcome-chat",
  title: "Welcome to Gemini Learning Assistant",
  model: "gemini-3.8-flash",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  messages: [
    {
      id: "welcome-msg",
      role: "assistant",
      content: `### Welcome to **GeminiGPT**! 🌟
Your dedicated interactive ChatGPT-style mentor for mastering **Google Gemini models** and the modern **@google/genai** SDK.

Here is what you can learn and test right now:

1. **Model Architectures & Selection**:
   - **Gemini 3.8 Flash**: High-speed, multimodal flagship with up to **1,048,576 tokens** context.
   - **Gemini 3.1 Pro**: Google's premier reasoning model with **2,097,152 tokens** context for complex coding and STEM.
   - **Gemini 3.1 Flash-Lite**: Ultra-cost-efficient, sub-250ms latency for massive high-throughput workloads.
   - **Specialized Models**: Gemini 3.8 Flash-Lite TTS (voice synthesis), Gemini 3.8 Live API (real-time voice/vision), and Gemini 3.1 Flash-Image.

2. **Core Capabilities**:
   - 🧠 **Thinking & Reasoning Levels**: \`ThinkingLevel.HIGH\`, \`LOW\`, and \`MINIMAL\`.
   - 👁️ **Multimodal**: Feed text, images, video frames, audio, and large PDFs simultaneously.
   - 🛠️ **Function Calling**: Provide tools and get structured arguments back.
   - 📋 **Structured JSON**: Guaranteed type-safe responses with the \`Type\` schema enum.
   - 🔍 **Google Search Grounding**: Connect Gemini directly to live web sources.

Click on any prompt card or interactive tool (**Model Matrix**, **Code Lab**, **Quiz**) above to begin!`,
      timestamp: Date.now(),
      modelUsed: "gemini-3.8-flash",
    },
  ],
};

export default function App() {
  // Load saved conversations or initialize
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Error loading conversations:", e);
    }
    return [INITIAL_CONVERSATION];
  });

  const [activeId, setActiveId] = useState<string>(() => {
    return conversations[0]?.id || "welcome-chat";
  });

  // Settings state
  const [selectedModel, setSelectedModel] = useState<string>("gemini-3.8-flash");
  const [thinkingLevel, setThinkingLevel] = useState<"HIGH" | "LOW" | "MINIMAL" | "OFF">("LOW");
  const [temperature, setTemperature] = useState<number>(0.7);
  const [systemPrompt, setSystemPrompt] = useState<string>(DEFAULT_SYSTEM_PROMPT);
  const [theme, setTheme] = useState<Theme>("dark");

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelComparisonOpen, setIsModelComparisonOpen] = useState(false);
  const [isCodeLabOpen, setIsCodeLabOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync conversations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.error("Failed to save conversations:", e);
    }
  }, [conversations]);

  // Handle global shortcuts (e.g. Cmd+K for new chat)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        handleNewChat();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const activeConversation =
    conversations.find((c) => c.id === activeId) || conversations[0];

  const handleNewChat = (initialPrompt?: string) => {
    const newId = `chat-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: initialPrompt ? initialPrompt.slice(0, 32) + "..." : "New Chat",
      model: selectedModel,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newId);

    if (initialPrompt) {
      setTimeout(() => {
        handleSendMessage(initialPrompt);
      }, 50);
    }
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (filtered.length === 0) {
        return [INITIAL_CONVERSATION];
      }
      return filtered;
    });

    if (activeId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      setActiveId(remaining[0]?.id || INITIAL_CONVERSATION.id);
    }
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to delete all chat history?")) {
      setConversations([INITIAL_CONVERSATION]);
      setActiveId(INITIAL_CONVERSATION.id);
    }
  };

  // Main Streaming Send Message Handler
  const handleSendMessage = async (content: string, images?: ChatImage[]) => {
    if (!content.trim() && (!images || images.length === 0)) return;

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `asst-${Date.now()}`;

    const userMessage: Message = {
      id: userMessageId,
      role: "user",
      content,
      images,
      timestamp: Date.now(),
    };

    const initialAssistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      modelUsed: selectedModel,
      thinkingLevel,
      isStreaming: true,
    };

    // Update conversation with user message and placeholder assistant message
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeId) {
          const updatedMessages = [...c.messages, userMessage, initialAssistantMessage];
          const updatedTitle =
            c.messages.length === 0 || c.title === "New Chat"
              ? content.slice(0, 36) + (content.length > 36 ? "..." : "")
              : c.title;

          return {
            ...c,
            title: updatedTitle,
            updatedAt: Date.now(),
            messages: updatedMessages,
          };
        }
        return c;
      })
    );

    setIsLoading(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      // Gather chat history to send to server
      const currentMessages = activeConversation ? [...activeConversation.messages, userMessage] : [userMessage];

      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortController.signal,
        body: JSON.stringify({
          messages: currentMessages,
          model: selectedModel,
          thinkingLevel: thinkingLevel !== "OFF" ? thinkingLevel : undefined,
          temperature,
          systemInstruction: systemPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream available.");

      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.replace("data: ", "").trim();
            if (!jsonStr) continue;

            try {
              const data = JSON.parse(jsonStr);
              if (data.error) {
                accumulatedText += `\n\n⚠️ **Error:** ${data.error}`;
              } else if (data.text) {
                accumulatedText += data.text;
              }

              // Update assistant message state progressively
              setConversations((prev) =>
                prev.map((c) => {
                  if (c.id === activeId) {
                    return {
                      ...c,
                      messages: c.messages.map((m) =>
                        m.id === assistantMessageId
                          ? { ...m, content: accumulatedText, isStreaming: !data.done }
                          : m
                      ),
                    };
                  }
                  return c;
                })
              );

              if (data.done) break;
            } catch (err) {
              // Ignore non-json chunk lines
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Generation stopped by user");
      } else {
        console.error("Stream error:", err);
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === activeId) {
              return {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === assistantMessageId
                    ? {
                        ...m,
                        content:
                          m.content ||
                          "⚠️ **Generation Failed**: Unable to communicate with Gemini API. Please verify server connectivity or try again.",
                        isError: true,
                        isStreaming: false,
                      }
                    : m
                ),
              };
            }
            return c;
          })
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
      // Mark isStreaming as false on complete
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeId) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === assistantMessageId ? { ...m, isStreaming: false } : m
              ),
            };
          }
          return c;
        })
      );
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const handleRegenerate = () => {
    if (!activeConversation || activeConversation.messages.length === 0) return;
    const msgs = activeConversation.messages;
    const lastUserMessage = [...msgs].reverse().find((m) => m.role === "user");
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content, lastUserMessage.images);
    }
  };

  const handleSelectModelAndChat = (modelId: string, prompt?: string) => {
    setSelectedModel(modelId);
    if (prompt) {
      handleNewChat(prompt);
    }
  };

  const currentModelDetail =
    GEMINI_MODELS_DATA.find((m) => m.id === selectedModel) || GEMINI_MODELS_DATA[0];

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden ${
        theme === "oled" ? "bg-black text-neutral-100" : "bg-neutral-900 text-neutral-100"
      }`}
    >
      {/* ChatGPT-style Left Sidebar */}
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelectConversation={(id) => setActiveId(id)}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        onClearAll={handleClearAll}
        onOpenModelComparison={() => setIsModelComparisonOpen(true)}
        onOpenCodeLab={() => setIsCodeLabOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isOpen={isSidebarOpen}
        onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
        activeModelName={currentModelDetail.name}
      />

      {/* Main Chat Center Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <ChatArea
          messages={activeConversation?.messages || []}
          isLoading={isLoading}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          thinkingLevel={thinkingLevel}
          onChangeThinkingLevel={setThinkingLevel}
          onSendMessage={handleSendMessage}
          onStopGeneration={handleStopGeneration}
          onRegenerate={handleRegenerate}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenModelComparison={() => setIsModelComparisonOpen(true)}
          onOpenCodeLab={() => setIsCodeLabOpen(true)}
          onOpenQuiz={() => setIsQuizOpen(true)}
          theme={theme}
        />
      </main>

      {/* Interactive Modals */}
      <ModelComparisonModal
        isOpen={isModelComparisonOpen}
        onClose={() => setIsModelComparisonOpen(false)}
        onSelectModelAndChat={handleSelectModelAndChat}
      />

      <SdkCodeLabModal
        isOpen={isCodeLabOpen}
        onClose={() => setIsCodeLabOpen(false)}
        onAskAssistant={(prompt) => {
          handleNewChat(prompt);
        }}
      />

      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onAskInChat={(question) => {
          handleNewChat(question);
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        temperature={temperature}
        onChangeTemperature={setTemperature}
        thinkingLevel={thinkingLevel}
        onChangeThinkingLevel={setThinkingLevel}
        systemPrompt={systemPrompt}
        onChangeSystemPrompt={setSystemPrompt}
        onResetSystemPrompt={() => setSystemPrompt(DEFAULT_SYSTEM_PROMPT)}
        theme={theme}
        onChangeTheme={setTheme}
      />
    </div>
  );
}
