import React, { useState } from "react";
import { marked } from "marked";
import { Check, Copy, Terminal } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, isStreaming }) => {
  // Extract and render with code block enhanced wrappers
  const renderFormattedContent = () => {
    // Configure marked options
    marked.setOptions({
      gfm: true,
      breaks: true,
    });

    const rawHtml = marked.parse(content || "") as string;
    return rawHtml;
  };

  return (
    <div className={`gemini-prose text-[15px] leading-relaxed break-words ${isStreaming ? "streaming-cursor" : ""}`}>
      <ContentWithCodeBlocks rawHtml={renderFormattedContent()} />
    </div>
  );
};

// Subcomponent to enrich <pre><code> blocks with copy action buttons and language badges
const ContentWithCodeBlocks: React.FC<{ rawHtml: string }> = ({ rawHtml }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const pres = containerRef.current.querySelectorAll("pre");
    pres.forEach((pre, index) => {
      // Check if wrapper already attached
      if (pre.getAttribute("data-enhanced") === "true") return;
      pre.setAttribute("data-enhanced", "true");

      const codeElement = pre.querySelector("code");
      const codeText = codeElement ? codeElement.innerText : pre.innerText;

      // Extract language from className (e.g. language-typescript)
      const className = codeElement?.className || "";
      const match = className.match(/language-(\w+)/);
      const language = match ? match[1] : "code";

      // Create header bar
      const header = document.createElement("div");
      header.className =
        "flex items-center justify-between px-3.5 py-1.5 bg-neutral-900 border-b border-neutral-700/60 text-xs text-neutral-400 font-mono select-none rounded-t-lg";

      const left = document.createElement("div");
      left.className = "flex items-center gap-1.5";
      left.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-blue-500/80 inline-block"></span><span>${language}</span>`;

      const copyBtn = document.createElement("button");
      copyBtn.className =
        "flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer";
      copyBtn.innerHTML = `<span>Copy code</span>`;

      copyBtn.onclick = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(codeText);
        copyBtn.innerHTML = `<span class="text-emerald-400">Copied!</span>`;
        setTimeout(() => {
          copyBtn.innerHTML = `<span>Copy code</span>`;
        }, 2000);
      };

      header.appendChild(left);
      header.appendChild(copyBtn);

      pre.className = "relative my-3 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 shadow-sm";
      pre.insertBefore(header, pre.firstChild);
      if (codeElement) {
        codeElement.className = `${className} block p-3.5 text-xs md:text-sm font-mono text-neutral-100 overflow-x-auto`;
      }
    });
  }, [rawHtml]);

  return (
    <div
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: rawHtml }}
    />
  );
};
