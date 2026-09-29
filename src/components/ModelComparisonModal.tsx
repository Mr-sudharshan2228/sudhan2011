import React, { useState } from "react";
import { X, Check, Calculator, Sparkles, Layers, DollarSign, Cpu, ArrowRight } from "lucide-react";
import { GEMINI_MODELS_DATA } from "../data/learningModules";

interface ModelComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModelAndChat: (modelId: string, prompt?: string) => void;
}

export const ModelComparisonModal: React.FC<ModelComparisonModalProps> = ({
  isOpen,
  onClose,
  onSelectModelAndChat,
}) => {
  const [inputTokensK, setInputTokensK] = useState<number>(500); // in thousands
  const [outputTokensK, setOutputTokensK] = useState<number>(100); // in thousands
  const [activeTab, setActiveTab] = useState<"matrix" | "calculator">("matrix");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-neutral-900 border border-neutral-750 rounded-2xl shadow-2xl overflow-hidden text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-800 bg-neutral-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Google Gemini Models Architecture Matrix
              </h2>
              <p className="text-xs text-neutral-400">
                Compare context limits, reasoning depth, multimodal modalities, and token economics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-neutral-800 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setActiveTab("matrix")}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  activeTab === "matrix" ? "bg-blue-600 text-white shadow-xs" : "text-neutral-400 hover:text-white"
                }`}
              >
                Model Matrix
              </button>
              <button
                onClick={() => setActiveTab("calculator")}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "calculator" ? "bg-blue-600 text-white shadow-xs" : "text-neutral-400 hover:text-white"
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                Cost Calculator
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === "matrix" ? (
            <>
              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {GEMINI_MODELS_DATA.slice(0, 3).map((model) => (
                  <div
                    key={model.id}
                    className={`rounded-xl border p-4.5 flex flex-col justify-between transition-all ${
                      model.id === "gemini-3.8-flash"
                        ? "bg-blue-950/20 border-blue-500/40 ring-1 ring-blue-500/30 shadow-lg shadow-blue-900/10"
                        : "bg-neutral-850/60 border-neutral-750 hover:border-neutral-600"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-neutral-800 text-blue-300 border border-neutral-700">
                          {model.tier}
                        </span>
                        {model.id === "gemini-3.8-flash" && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                            Recommended
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white mt-2.5">{model.name}</h3>
                      <p className="text-xs text-neutral-400 mt-1 min-h-[34px]">{model.tagline}</p>

                      <div className="mt-4 pt-3 border-t border-neutral-800 space-y-2 text-xs">
                        <div className="flex justify-between py-1 border-b border-neutral-800/60">
                          <span className="text-neutral-400">Context Window</span>
                          <span className="font-semibold text-sky-300">{model.contextWindow.split(" ")[0]}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-neutral-800/60">
                          <span className="text-neutral-400">Max Output</span>
                          <span className="font-mono text-neutral-200">{model.maxOutputTokens}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-neutral-800/60">
                          <span className="text-neutral-400">Latency / Speed</span>
                          <span className="text-neutral-200">{model.speed}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-neutral-800/60">
                          <span className="text-neutral-400">Reasoning</span>
                          <span className="text-neutral-200 text-right truncate max-w-[150px]">{model.reasoning}</span>
                        </div>
                        <div className="py-1">
                          <span className="text-neutral-400 block text-[11px] mb-1">Pricing per 1M tokens</span>
                          <span className="text-emerald-400 font-medium text-[11px] block">{model.pricing}</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                          Best For
                        </span>
                        <p className="text-xs text-neutral-300 bg-neutral-900/60 p-2 rounded border border-neutral-800">
                          {model.bestFor}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onSelectModelAndChat(model.id, `Tell me more about architectural strengths and code patterns for ${model.name}.`);
                      }}
                      className="mt-4 w-full py-2 px-3 rounded-lg bg-neutral-800 hover:bg-blue-600 text-neutral-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Explore {model.name.replace("Gemini ", "")}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Full Specs Table */}
              <div className="mt-6">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  Complete Modalities & Specialized Models Directory
                </h3>
                <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-950/60">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 bg-neutral-900/80 text-neutral-400 font-semibold">
                        <th className="p-3">Model</th>
                        <th className="p-3">Primary Modalities</th>
                        <th className="p-3">Thinking Levels</th>
                        <th className="p-3">Target Workload</th>
                        <th className="p-3">SDK Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800 text-neutral-300">
                      {GEMINI_MODELS_DATA.map((m) => (
                        <tr key={m.id} className="hover:bg-neutral-900/40 transition-colors">
                          <td className="p-3 font-semibold text-white whitespace-nowrap">
                            {m.name}
                            <div className="text-[10px] text-neutral-400 font-mono font-normal">{m.id}</div>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {m.modalities.map((mod, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded border border-neutral-700/60"
                                >
                                  {mod}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-3 font-mono text-[11px] text-sky-300">
                            {m.id.includes("lite") && !m.id.includes("tts") ? "MINIMAL" : "LOW / HIGH"}
                          </td>
                          <td className="p-3 text-neutral-400">{m.bestFor}</td>
                          <td className="p-3 whitespace-nowrap">
                            <button
                              onClick={() => {
                                onClose();
                                onSelectModelAndChat(m.id);
                              }}
                              className="text-xs text-blue-400 hover:text-blue-300 font-medium hover:underline cursor-pointer"
                            >
                              Test Model →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            /* Cost Calculator */
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs text-blue-200">
                <span className="font-semibold text-blue-100 block mb-0.5">Token Economics Simulator</span>
                Calculate estimated operational costs for your workload across Gemini 3.8 Flash, 3.1 Pro, and 3.1 Flash-Lite.
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-neutral-850 p-5 rounded-xl border border-neutral-750">
                <div>
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="font-semibold text-neutral-300">Monthly Input Tokens</span>
                    <span className="font-mono text-sky-400 font-bold">{inputTokensK.toLocaleString()}k tokens</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="5000"
                    step="50"
                    value={inputTokensK}
                    onChange={(e) => setInputTokensK(parseInt(e.target.value, 10))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                    <span>10k (~7k words)</span>
                    <span>5M (~3.5M words)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="font-semibold text-neutral-300">Monthly Output Tokens</span>
                    <span className="font-mono text-emerald-400 font-bold">{outputTokensK.toLocaleString()}k tokens</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="1000"
                    step="10"
                    value={outputTokensK}
                    onChange={(e) => setOutputTokensK(parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                    <span>5k (~3.5k words)</span>
                    <span>1M (~700k words)</span>
                  </div>
                </div>
              </div>

              {/* Cost Results Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    name: "Gemini 3.1 Flash-Lite",
                    inRate: 0.01875,
                    outRate: 0.075,
                    color: "amber",
                    tag: "Ultra-budget"
                  },
                  {
                    name: "Gemini 3.8 Flash",
                    inRate: 0.075,
                    outRate: 0.30,
                    color: "blue",
                    tag: "Best Value"
                  },
                  {
                    name: "Gemini 3.1 Pro",
                    inRate: 1.25,
                    outRate: 5.00,
                    color: "purple",
                    tag: "Complex STEM/Code"
                  }
                ].map((item, idx) => {
                  const inputCost = (inputTokensK / 1000) * item.inRate;
                  const outputCost = (outputTokensK / 1000) * item.outRate;
                  const totalCost = inputCost + outputCost;

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{item.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-medium">
                            {item.tag}
                          </span>
                        </div>

                        <div className="mt-4">
                          <div className="text-[11px] text-neutral-400">Estimated Total</div>
                          <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                            ${totalCost.toFixed(3)}
                            <span className="text-xs font-normal text-neutral-400"> /mo</span>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-neutral-800 space-y-1 text-[11px]">
                          <div className="flex justify-between text-neutral-400">
                            <span>Input cost:</span>
                            <span className="font-mono text-neutral-200">${inputCost.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between text-neutral-400">
                            <span>Output cost:</span>
                            <span className="font-mono text-neutral-200">${outputCost.toFixed(4)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
