import React from "react";
import { X, Sliders, Moon, Sun, Monitor, ShieldCheck, RefreshCw, Cpu } from "lucide-react";
import { Theme } from "../types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  temperature: number;
  onChangeTemperature: (val: number) => void;
  thinkingLevel: "HIGH" | "LOW" | "MINIMAL" | "OFF";
  onChangeThinkingLevel: (level: "HIGH" | "LOW" | "MINIMAL" | "OFF") => void;
  systemPrompt: string;
  onChangeSystemPrompt: (val: string) => void;
  onResetSystemPrompt: () => void;
  theme: Theme;
  onChangeTheme: (theme: Theme) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  temperature,
  onChangeTemperature,
  thinkingLevel,
  onChangeThinkingLevel,
  systemPrompt,
  onChangeSystemPrompt,
  onResetSystemPrompt,
  theme,
  onChangeTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-750 rounded-2xl shadow-2xl overflow-hidden text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-800 bg-neutral-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Assistant & Model Settings</h2>
              <p className="text-xs text-neutral-400">Configure parameters for Gemini models generation</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-5 text-xs">
          {/* Temperature */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-semibold text-neutral-200">Temperature: {temperature}</label>
              <span className="text-[11px] text-neutral-400">
                {temperature < 0.3 ? "Deterministic" : temperature > 0.8 ? "Highly Creative" : "Balanced"}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={temperature}
              onChange={(e) => onChangeTemperature(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              Lower values give more focused and concise code; higher values generate creative explanations.
            </p>
          </div>

          {/* Thinking Level */}
          <div>
            <label className="font-semibold text-neutral-200 block mb-1.5">Thinking & Reasoning Level</label>
            <div className="grid grid-cols-4 gap-2">
              {(["OFF", "MINIMAL", "LOW", "HIGH"] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => onChangeThinkingLevel(lvl)}
                  className={`py-2 px-3 rounded-lg font-medium border text-xs transition-colors cursor-pointer ${
                    thinkingLevel === lvl
                      ? "bg-blue-600 border-blue-500 text-white shadow-xs"
                      : "bg-neutral-800/80 border-neutral-700 text-neutral-400 hover:text-white"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1.5">
              Controls reasoning tokens for Gemini 3 series. HIGH maximizes reasoning depth; MINIMAL guarantees lowest latency.
            </p>
          </div>

          {/* Theme */}
          <div>
            <label className="font-semibold text-neutral-200 block mb-1.5">Theme Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "dark", label: "Dark (Zinc)", icon: Moon },
                { id: "oled", label: "OLED (Black)", icon: Monitor },
                { id: "light", label: "Light (Clean)", icon: Sun }
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => onChangeTheme(t.id as Theme)}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "bg-neutral-800/80 border-neutral-700 text-neutral-400 hover:text-white"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* System Prompt Customization */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-neutral-200">System Instruction</label>
              <button
                onClick={onResetSystemPrompt}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Reset to default
              </button>
            </div>
            <textarea
              rows={3}
              value={systemPrompt}
              onChange={(e) => onChangeSystemPrompt(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 font-mono focus:border-blue-500 outline-none resize-none"
              placeholder="Custom instructions for the Gemini mentor..."
            />
          </div>

          {/* Security & Runtime info */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Server-side @google/genai proxy active
            </span>
            <span className="font-mono">v2.4.0</span>
          </div>
        </div>

        <div className="p-4 bg-neutral-950/60 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="py-1.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
