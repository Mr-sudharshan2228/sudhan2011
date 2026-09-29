import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Zap, Brain, Feather, Sparkles, Volume2, ShieldAlert } from "lucide-react";
import { GEMINI_MODELS_DATA } from "../data/learningModules";

interface ModelSelectorProps {
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  thinkingLevel: "HIGH" | "LOW" | "MINIMAL" | "OFF";
  onChangeThinkingLevel: (level: "HIGH" | "LOW" | "MINIMAL" | "OFF") => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onSelectModel,
  thinkingLevel,
  onChangeThinkingLevel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentModel = GEMINI_MODELS_DATA.find((m) => m.id === selectedModel) || GEMINI_MODELS_DATA[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getModelIcon = (id: string) => {
    if (id.includes("pro")) return <Brain className="w-4 h-4 text-purple-400" />;
    if (id.includes("lite-tts")) return <Volume2 className="w-4 h-4 text-emerald-400" />;
    if (id.includes("lite")) return <Feather className="w-4 h-4 text-amber-400" />;
    return <Zap className="w-4 h-4 text-blue-400" />;
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/80 text-white font-medium text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
      >
        <span className="flex items-center gap-1.5">
          {getModelIcon(currentModel.id)}
          <span className="font-semibold text-neutral-100">{currentModel.name}</span>
        </span>
        <span className="hidden sm:inline-block text-[11px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
          {currentModel.contextWindow.split(" ")[0]} ctx
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-80 sm:w-96 rounded-xl bg-neutral-900 border border-neutral-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-2 border-b border-neutral-800">
            <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              Select Google Gemini Model
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">
              Choose the model architecture to test and learn with
            </div>
          </div>

          <div className="py-1 space-y-1 max-h-72 overflow-y-auto">
            {GEMINI_MODELS_DATA.map((model) => {
              const isSelected = model.id === selectedModel;
              return (
                <button
                  key={model.id}
                  onClick={() => {
                    onSelectModel(model.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-blue-600/15 border border-blue-500/40 text-white"
                      : "hover:bg-neutral-800/80 text-neutral-300"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{getModelIcon(model.id)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-xs text-neutral-100">{model.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate mt-0.5">{model.tagline}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-400">
                      <span className="text-sky-300 font-mono">{model.contextWindow.split(" ")[0]} ctx</span>
                      <span>•</span>
                      <span>{model.speed}</span>
                      {model.paidKeyRequired && (
                        <span className="text-amber-400 font-medium ml-auto flex items-center gap-0.5">
                          <ShieldAlert className="w-2.5 h-2.5" /> Pro key
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Thinking Level Quick Selector */}
          <div className="mt-2 pt-2 border-t border-neutral-800 px-3 pb-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-neutral-300 flex items-center gap-1">
                <Brain className="w-3 h-3 text-purple-400" /> Thinking Level (Gemini 3)
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">{thinkingLevel}</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {(["OFF", "MINIMAL", "LOW", "HIGH"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => onChangeThinkingLevel(level)}
                  className={`py-1 text-[10px] rounded font-medium transition-colors cursor-pointer ${
                    thinkingLevel === level
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-750"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
