import React, { useRef, useEffect, useState } from "react";
import {
  ArrowUp,
  Square,
  Sparkles,
  Paperclip,
  Image as ImageIcon,
  Copy,
  Check,
  RotateCw,
  Volume2,
  VolumeX,
  PanelLeft,
  Layers,
  Code2,
  HelpCircle,
  X,
  Zap,
  Brain,
  Info,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ArrowRight,
  Terminal,
  Compass,
  Mic,
  Maximize2
} from "lucide-react";
import { Message, ChatImage, Theme, LearningTopic } from "../types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { ModelSelector } from "./ModelSelector";
import { PRESET_STARTER_PROMPTS, LEARNING_TOPICS, GEMINI_MODELS_DATA } from "../data/learningModules";

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  selectedModel: string;
  onSelectModel: (id: string) => void;
  thinkingLevel: "HIGH" | "LOW" | "MINIMAL" | "OFF";
  onChangeThinkingLevel: (level: "HIGH" | "LOW" | "MINIMAL" | "OFF") => void;
  onSendMessage: (content: string, images?: ChatImage[]) => void;
  onStopGeneration: () => void;
  onRegenerate: () => void;
  onToggleSidebar: () => void;
  onOpenModelComparison: () => void;
  onOpenCodeLab: () => void;
  onOpenQuiz: () => void;
  theme: Theme;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  selectedModel,
  onSelectModel,
  thinkingLevel,
  onChangeThinkingLevel,
  onSendMessage,
  onStopGeneration,
  onRegenerate,
  onToggleSidebar,
  onOpenModelComparison,
  onOpenCodeLab,
  onOpenQuiz,
  theme,
}) => {
  const [input, setInput] = useState("");
  const [images, setImages] = useState<ChatImage[]>([]);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // Accessible Chat Section Grid State
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [activeGridTab, setActiveGridTab] = useState<"starters" | "topics" | "models">("starters");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new message or stream chunk
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if ((!input.trim() && images.length === 0) || isLoading) return;
    onSendMessage(input.trim(), images.length > 0 ? images : undefined);
    setInput("");
    setImages([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    // Auto collapse grid drawer if open
    setIsGridOpen(false);
  };

  const handleSelectPrompt = (promptText: string) => {
    onSendMessage(promptText);
    setIsGridOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setImages((prev) => [
          ...prev,
          {
            data: base64,
            mimeType: file.type,
            name: file.name,
            size: file.size,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const copyMessageText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const speakMessage = (id: string, text: string) => {
    if (!window.speechSynthesis) return;

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[`#*_\-[\]]/g, " ").slice(0, 800);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case "Layers": return <Layers className="w-4 h-4 text-blue-400" />;
      case "Brain": return <Brain className="w-4 h-4 text-purple-400" />;
      case "Maximize2": return <Maximize2 className="w-4 h-4 text-sky-400" />;
      case "Image": return <ImageIcon className="w-4 h-4 text-emerald-400" />;
      case "Terminal": return <Terminal className="w-4 h-4 text-amber-400" />;
      case "Compass": return <Compass className="w-4 h-4 text-cyan-400" />;
      case "Mic": return <Mic className="w-4 h-4 text-rose-400" />;
      default: return <Code2 className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-900 overflow-hidden relative">
      {/* Top Header Bar */}
      <header className="h-14 border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-xs flex items-center justify-between px-3 sm:px-4 z-20 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            title="Toggle sidebar"
          >
            <PanelLeft className="w-5 h-5" />
          </button>

          {/* Model Selector dropdown */}
          <ModelSelector
            selectedModel={selectedModel}
            onSelectModel={onSelectModel}
            thinkingLevel={thinkingLevel}
            onChangeThinkingLevel={onChangeThinkingLevel}
          />
        </div>

        {/* Action Buttons in Header */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Direct Accessible Chat Grids Button */}
          <button
            onClick={() => setIsGridOpen(!isGridOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer shadow-xs ${
              isGridOpen
                ? "bg-blue-600 text-white border-blue-500 shadow-blue-500/20"
                : "bg-blue-600/15 hover:bg-blue-600/25 border-blue-500/40 text-blue-300 hover:text-white"
            }`}
            title="Access chat prompt and learning grids"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-medium">Browse Grids</span>
            {isGridOpen ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
          </button>

          <button
            onClick={onOpenModelComparison}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Compare Models</span>
          </button>

          <button
            onClick={onOpenCodeLab}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Code Lab</span>
          </button>

          <button
            onClick={onOpenQuiz}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Quiz</span>
          </button>
        </div>
      </header>

      {/* Expandable Top Grid Section Drawer (Always Accessible in Any Chat) */}
      {isGridOpen && (
        <div className="bg-neutral-950/95 border-b border-neutral-800 p-4 sm:p-5 z-10 shadow-2xl backdrop-blur-md animate-in slide-in-from-top-3 duration-200 shrink-0 max-h-[60vh] overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Drawer Header & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Chat Section Knowledge & Prompt Grids
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Click any card to immediately prompt the assistant
                  </p>
                </div>
              </div>

              {/* Grid Category Tabs */}
              <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800 text-xs">
                <button
                  onClick={() => setActiveGridTab("starters")}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    activeGridTab === "starters" ? "bg-blue-600 text-white shadow-xs" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Prompt Starters
                </button>
                <button
                  onClick={() => setActiveGridTab("topics")}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    activeGridTab === "topics" ? "bg-blue-600 text-white shadow-xs" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Learning Topics (8)
                </button>
                <button
                  onClick={() => setActiveGridTab("models")}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    activeGridTab === "models" ? "bg-blue-600 text-white shadow-xs" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Gemini Models (6)
                </button>
              </div>
            </div>

            {/* TAB 1: Starter Prompts Grid */}
            {activeGridTab === "starters" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESET_STARTER_PROMPTS.map((starter, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPrompt(starter.prompt)}
                    className="p-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-blue-500/50 transition-all text-left group cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center justify-between font-semibold text-xs sm:text-sm text-neutral-100 group-hover:text-blue-300">
                      <span>{starter.title}</span>
                      <ArrowUp className="w-3.5 h-3.5 text-blue-400 rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-1 line-clamp-1">{starter.subtitle}</div>
                    <div className="text-[11px] text-neutral-400 mt-1.5 font-mono line-clamp-2 bg-neutral-950 p-2 rounded border border-neutral-800/80">
                      "{starter.prompt}"
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* TAB 2: Learning Topics Grid */}
            {activeGridTab === "topics" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {LEARNING_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleSelectPrompt(topic.suggestedPrompt)}
                    className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-purple-500/50 transition-all text-left flex flex-col justify-between group cursor-pointer shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-1.5 rounded-lg bg-neutral-800 border border-neutral-700">
                          {getTopicIcon(topic.icon)}
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700/60">
                          {topic.difficulty}
                        </span>
                      </div>
                      <div className="font-semibold text-xs text-neutral-100 group-hover:text-purple-300 line-clamp-1">
                        {topic.title}
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-1 line-clamp-2">
                        {topic.description}
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px] text-blue-400 group-hover:text-blue-300 font-medium">
                      <span>Start module</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* TAB 3: Models Directory Grid */}
            {activeGridTab === "models" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {GEMINI_MODELS_DATA.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectModel(m.id);
                      handleSelectPrompt(`Tell me all key architectural features, benchmarks, and @google/genai code samples for ${m.name}.`);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all group cursor-pointer shadow-sm ${
                      m.id === selectedModel
                        ? "bg-blue-950/30 border-blue-500/60 ring-1 ring-blue-500/40"
                        : "bg-neutral-900 hover:bg-neutral-850 border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-blue-300">{m.name}</span>
                      <span className="text-[10px] font-mono text-sky-400 bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-700">
                        {m.contextWindow.split(" ")[0]} ctx
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2">{m.tagline}</p>
                    <div className="mt-2.5 pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400">
                      <span>{m.speed}</span>
                      <span className="text-blue-400 font-medium group-hover:underline">Explore model →</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-6">
        {messages.length === 0 ? (
          /* Empty State Hero (ChatGPT Style) with Primary Grids */
          <div className="max-w-3xl mx-auto py-6 sm:py-12 text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20 ring-4 ring-blue-500/10">
              <Sparkles className="w-7 h-7 text-white" />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                What would you like to master about Google Gemini?
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl mx-auto">
                Explore Gemini 3.8 Flash, Gemini 3.1 Pro, multimodal vision, 2M token context windows, thinking levels, and the modern @google/genai SDK.
              </p>
            </div>

            {/* Chat Section Primary Starter Grid */}
            <div className="text-left max-w-2xl mx-auto pt-2">
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <LayoutGrid className="w-3.5 h-3.5 text-blue-400" />
                  Quick Starter Prompts Grid
                </span>
                <span className="text-[11px] text-neutral-400">Click to run</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESET_STARTER_PROMPTS.map((starter, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPrompt(starter.prompt)}
                    className="p-3.5 rounded-xl bg-neutral-800/90 hover:bg-neutral-800 border border-neutral-700/80 hover:border-blue-500/50 transition-all text-left group cursor-pointer shadow-xs"
                  >
                    <div className="font-semibold text-xs sm:text-sm text-neutral-200 group-hover:text-blue-400 flex items-center justify-between">
                      <span>{starter.title}</span>
                      <ArrowUp className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity text-blue-400 rotate-45" />
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-1">{starter.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Learning Topics Grid Section */}
            <div className="text-left max-w-2xl mx-auto pt-2">
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  Gemini Learning Topics Grid
                </span>
                <button
                  onClick={() => setIsGridOpen(true)}
                  className="text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  View all 8 topics →
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {LEARNING_TOPICS.slice(0, 4).map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleSelectPrompt(topic.suggestedPrompt)}
                    className="p-2.5 rounded-lg bg-neutral-800/70 hover:bg-neutral-750 border border-neutral-700/60 hover:border-neutral-600 text-left transition-colors cursor-pointer group"
                  >
                    <div className="mb-1.5">{getTopicIcon(topic.icon)}</div>
                    <div className="font-medium text-xs text-neutral-200 group-hover:text-blue-300 truncate">
                      {topic.title}
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-0.5 truncate">{topic.difficulty}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Messages List */
          <div className="max-w-3xl mx-auto space-y-6 pb-2">
            {messages.map((message, mIndex) => {
              const isUser = message.role === "user";
              const isFirstAssistantWelcome = !isUser && mIndex === 0 && message.id === "welcome-msg";

              return (
                <div key={message.id} className="space-y-4">
                  <div className={`flex gap-3 sm:gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
                    {/* Assistant Avatar */}
                    {!isUser && (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[88%] sm:max-w-[82%] rounded-2xl ${
                        isUser
                          ? "bg-neutral-800 text-neutral-100 px-4 py-2.5 rounded-tr-xs border border-neutral-700"
                          : "text-neutral-100 px-1 py-1"
                      }`}
                    >
                      {/* Attached images */}
                      {message.images && message.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {message.images.map((img, idx) => (
                            <div key={idx} className="relative rounded-lg overflow-hidden border border-neutral-700 max-w-[200px]">
                              <img
                                src={img.data}
                                alt={img.name || "Multimodal attachment"}
                                className="w-full h-auto max-h-48 object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Content */}
                      {isUser ? (
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      ) : (
                        <div>
                          {message.thinkingLevel && message.thinkingLevel !== "OFF" && (
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mb-2 rounded bg-purple-500/10 text-purple-300 text-[10px] font-medium border border-purple-500/20">
                              <Brain className="w-3 h-3 text-purple-400" />
                              <span>Reasoning Config: ThinkingLevel.{message.thinkingLevel}</span>
                            </div>
                          )}

                          <MarkdownRenderer
                            content={message.content}
                            isStreaming={message.isStreaming}
                          />

                          {message.isError && (
                            <div className="mt-2 p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-300">
                              {message.content}
                            </div>
                          )}

                          {!message.isStreaming && message.content && (
                            <div className="flex items-center gap-1.5 mt-3 pt-2 text-neutral-400 text-xs select-none">
                              <button
                                onClick={() => copyMessageText(message.id, message.content)}
                                className="p-1 hover:text-white hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                                title="Copy response"
                              >
                                {copiedMessageId === message.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>

                              <button
                                onClick={() => speakMessage(message.id, message.content)}
                                className={`p-1 hover:text-white hover:bg-neutral-800 rounded transition-colors cursor-pointer ${
                                  speakingMessageId === message.id ? "text-blue-400 bg-neutral-800" : ""
                                }`}
                                title={speakingMessageId === message.id ? "Stop voice" : "Read aloud"}
                              >
                                {speakingMessageId === message.id ? (
                                  <VolumeX className="w-3.5 h-3.5" />
                                ) : (
                                  <Volume2 className="w-3.5 h-3.5" />
                                )}
                              </button>

                              {message.modelUsed && (
                                <span className="text-[10px] text-neutral-400 px-2 py-0.5 rounded bg-neutral-800 font-mono ml-1 border border-neutral-700">
                                  {message.modelUsed}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-neutral-700 flex items-center justify-center shrink-0 font-medium text-xs text-neutral-300 mt-0.5">
                        U
                      </div>
                    )}
                  </div>

                  {/* If this is the welcome message, show the starter prompt cards grid directly beneath it! */}
                  {isFirstAssistantWelcome && (
                    <div className="mt-4 pt-4 border-t border-neutral-800/80">
                      <div className="flex items-center justify-between mb-3 px-1">
                        <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                          <LayoutGrid className="w-3.5 h-3.5 text-blue-400" />
                          Explore Starter Prompts Grid
                        </span>
                        <span className="text-[11px] text-neutral-400">Click to test instantly</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {PRESET_STARTER_PROMPTS.map((starter, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelectPrompt(starter.prompt)}
                            className="p-3 rounded-xl bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 hover:border-blue-500/50 transition-all text-left group cursor-pointer shadow-xs"
                          >
                            <div className="font-semibold text-xs sm:text-sm text-neutral-200 group-hover:text-blue-400 flex items-center justify-between">
                              <span>{starter.title}</span>
                              <ArrowUp className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity text-blue-400 rotate-45" />
                            </div>
                            <div className="text-[11px] text-neutral-400 mt-0.5">{starter.subtitle}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && !messages.some((m) => m.isStreaming) && (
              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white animate-spin" />
                </div>
                <div className="bg-neutral-800/80 rounded-xl px-4 py-2.5 text-xs text-neutral-400 flex items-center gap-2 border border-neutral-700">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  <span>Gemini is generating response...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Bottom Input Area (ChatGPT Style) with Quick Grids Strip */}
      <div className="border-t border-neutral-800 bg-neutral-900/95 backdrop-blur-xs p-3 sm:p-4 z-20 shrink-0">
        <div className="max-w-3xl mx-auto">
          {/* Quick Grids Access Strip above textarea */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-[11px]">
            <button
              onClick={() => setIsGridOpen(!isGridOpen)}
              className="px-2.5 py-1 rounded-full bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-500/40 font-medium flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
            >
              <LayoutGrid className="w-3 h-3" />
              <span>{isGridOpen ? "Close Grids" : "⚡ Explore Grids"}</span>
            </button>

            {PRESET_STARTER_PROMPTS.map((starter, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPrompt(starter.prompt)}
                className="px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-neutral-750 text-neutral-300 hover:text-white border border-neutral-700 shrink-0 transition-colors cursor-pointer truncate max-w-[200px]"
                title={starter.prompt}
              >
                {starter.title}
              </button>
            ))}
          </div>

          {/* Multimodal image previews */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2 p-2 bg-neutral-950 rounded-xl border border-neutral-800">
              {images.map((img, idx) => (
                <div key={idx} className="relative group rounded-lg overflow-hidden border border-neutral-700">
                  <img src={img.data} alt="Upload preview" className="w-16 h-16 object-cover" />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-black/80 text-white hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <div className="flex items-center text-xs text-neutral-400 px-2">
                <span>{images.length} multimodal image(s) attached</span>
              </div>
            </div>
          )}

          {/* Textarea Input Box */}
          <div className="relative flex items-end gap-2 bg-neutral-800 border border-neutral-700 rounded-2xl p-2 sm:p-2.5 focus-within:border-neutral-500 focus-within:ring-1 focus-within:ring-neutral-500 transition-all shadow-md">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Attach images for multimodal testing"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Gemini models, architecture, @google/genai SDK, context windows..."
              className="flex-1 bg-transparent border-0 outline-none text-neutral-100 placeholder-neutral-400 text-xs sm:text-sm resize-none py-1.5 max-h-44 leading-relaxed"
            />

            {isLoading ? (
              <button
                onClick={onStopGeneration}
                className="p-2 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer shrink-0 shadow-sm"
                title="Stop generating"
              >
                <Square className="w-4 h-4 fill-white" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!input.trim() && images.length === 0}
                className={`p-2 rounded-xl transition-all cursor-pointer shrink-0 shadow-sm ${
                  input.trim() || images.length > 0
                    ? "bg-white text-black hover:bg-neutral-200"
                    : "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                }`}
                title="Send prompt"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Footer Disclaimer */}
          <div className="flex items-center justify-between text-[11px] text-neutral-400 text-center mt-2 px-2">
            <span>GeminiGPT Learning Assistant • Model responses powered by Google GenAI</span>
            {messages.length > 1 && !isLoading && (
              <button
                onClick={onRegenerate}
                className="hover:text-neutral-300 flex items-center gap-1 cursor-pointer"
              >
                <RotateCw className="w-3 h-3" /> Regenerate
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
