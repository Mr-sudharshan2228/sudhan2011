import React, { useState } from "react";
import {
  Plus,
  MessageSquare,
  Sparkles,
  Layers,
  Code2,
  HelpCircle,
  Settings,
  Trash2,
  Edit2,
  Check,
  X,
  ChevronDown,
  BookOpen,
  PanelLeftClose,
  Zap,
  Cpu
} from "lucide-react";
import { Conversation, LearningTopic } from "../types";
import { LEARNING_TOPICS } from "../data/learningModules";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string;
  onSelectConversation: (id: string) => void;
  onNewChat: (initialPrompt?: string) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onClearAll: () => void;
  onOpenModelComparison: () => void;
  onOpenCodeLab: () => void;
  onOpenQuiz: () => void;
  onOpenSettings: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  activeModelName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onRenameConversation,
  onClearAll,
  onOpenModelComparison,
  onOpenCodeLab,
  onOpenQuiz,
  onOpenSettings,
  isOpen,
  onToggleOpen,
  activeModelName
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [showLearningModules, setShowLearningModules] = useState(true);

  const startRename = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const saveRename = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const cancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-xs"
          onClick={onToggleOpen}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 flex flex-col w-72 bg-neutral-900 border-r border-neutral-800 text-neutral-200 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${!isOpen ? "lg:hidden" : ""}`}
      >
        {/* Top Header */}
        <div className="p-3.5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <div className="font-semibold text-sm tracking-tight text-white flex items-center gap-1.5">
                GeminiGPT
                <span className="text-[10px] font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.2 rounded-full">
                  Assistant
                </span>
              </div>
              <div className="text-[11px] text-neutral-400">Google Gemini Mentor</div>
            </div>
          </div>

          <button
            onClick={onToggleOpen}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md transition-colors"
            title="Close sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => onNewChat()}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 border border-neutral-700/70 text-sm font-medium text-white transition-all shadow-xs group cursor-pointer"
          >
            <span className="flex items-center gap-2.5">
              <Plus className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
              <span>New chat</span>
            </span>
            <kbd className="hidden sm:inline-block text-[10px] bg-neutral-900 border border-neutral-700 px-1.5 py-0.5 rounded text-neutral-400 font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Scrollable Center Section */}
        <div className="flex-1 overflow-y-auto px-3 space-y-4 text-xs">
          {/* Interactive Tools */}
          <div>
            <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-sky-400" />
              Interactive Tools
            </div>
            <div className="mt-1 space-y-1">
              <button
                onClick={onOpenModelComparison}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-colors text-left cursor-pointer"
              >
                <Layers className="w-4 h-4 text-blue-400 shrink-0" />
                <div className="truncate">
                  <div className="font-medium text-xs">Model Comparison Matrix</div>
                  <div className="text-[10px] text-neutral-400">Context, latency & pricing</div>
                </div>
              </button>

              <button
                onClick={onOpenCodeLab}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-colors text-left cursor-pointer"
              >
                <Code2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="truncate">
                  <div className="font-medium text-xs">@google/genai Code Lab</div>
                  <div className="text-[10px] text-neutral-400">Ready TypeScript & Python</div>
                </div>
              </button>

              <button
                onClick={onOpenQuiz}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-colors text-left cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="truncate">
                  <div className="font-medium text-xs">Gemini Mastery Quiz</div>
                  <div className="text-[10px] text-neutral-400">Test architecture knowledge</div>
                </div>
              </button>
            </div>
          </div>

          {/* Curated Gemini Learning Modules */}
          <div>
            <button
              onClick={() => setShowLearningModules(!showLearningModules)}
              className="w-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 flex items-center justify-between hover:text-neutral-200"
            >
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3 h-3 text-purple-400" />
                Learning Pathways
              </span>
              <ChevronDown
                className={`w-3 h-3 transition-transform ${showLearningModules ? "rotate-180" : ""}`}
              />
            </button>

            {showLearningModules && (
              <div className="mt-1 space-y-0.5">
                {LEARNING_TOPICS.slice(0, 5).map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => onNewChat(topic.suggestedPrompt)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-neutral-300 hover:text-white hover:bg-neutral-800/70 transition-colors text-left group cursor-pointer"
                  >
                    <span className="truncate pr-1 text-neutral-300 group-hover:text-blue-300">
                      {topic.title}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 shrink-0 border border-neutral-700/50">
                      {topic.difficulty}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Conversation History */}
          <div>
            <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
              <span>Chats ({conversations.length})</span>
              {conversations.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-[10px] text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                  title="Clear all chats"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="mt-1 space-y-0.5">
              {conversations.length === 0 ? (
                <div className="px-2.5 py-3 text-center text-neutral-400 text-[11px]">
                  No past chats yet. Start learning!
                </div>
              ) : (
                conversations.map((conv) => {
                  const isActive = conv.id === activeId;
                  const isEditing = editingId === conv.id;

                  return (
                    <div
                      key={conv.id}
                      onClick={() => onSelectConversation(conv.id)}
                      className={`group relative flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                        isActive
                          ? "bg-neutral-800 text-white font-medium shadow-xs"
                          : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate mr-2 flex-1">
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-blue-400" : "text-neutral-400"}`} />
                        {isEditing ? (
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveRename(conv.id, e as any);
                              if (e.key === "Escape") cancelRename(e as any);
                            }}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                            className="bg-neutral-900 border border-blue-500 rounded px-1.5 py-0.5 text-xs text-white outline-none w-full"
                          />
                        ) : (
                          <span className="truncate">{conv.title}</span>
                        )}
                      </div>

                      {/* Action buttons */}
                      {isEditing ? (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => saveRename(conv.id, e)}
                            className="p-1 hover:text-emerald-400 text-neutral-400"
                            title="Save title"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={cancelRename}
                            className="p-1 hover:text-neutral-300 text-neutral-400"
                            title="Cancel"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => startRename(conv, e)}
                            className="p-1 text-neutral-400 hover:text-neutral-200"
                            title="Rename"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteConversation(conv.id);
                            }}
                            className="p-1 text-neutral-400 hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Bottom Profile / Settings Area */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-900/90 space-y-2">
          {/* Active Model Pill */}
          <div className="px-2.5 py-1.5 rounded-lg bg-neutral-950/70 border border-neutral-800 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <Zap className="w-3 h-3 text-amber-400" />
              <span className="truncate">{activeModelName}</span>
            </span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              1M ctx
            </span>
          </div>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors text-xs cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                G
              </div>
              <span className="font-medium">Model Settings</span>
            </div>
            <Settings className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
      </aside>
    </>
  );
};
