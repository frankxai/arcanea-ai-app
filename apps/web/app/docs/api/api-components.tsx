"use client";

import { useState } from "react";
import { Endpoint, METHOD_COLORS } from "./api-data";

export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 hover:text-[#7fffd4] transition-colors"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed">
        <code className="font-mono text-neutral-300">{code}</code>
      </pre>
    </div>
  );
}

export function EndpointCard({
  endpoint,
  color,
}: {
  endpoint: Endpoint;
  color: string;
}) {
  const [tab, setTab] = useState<"curl" | "typescript">("curl");
  const methodStyle = METHOD_COLORS[endpoint.method];

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/10 transition-colors">
      <div className="px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-3 mb-2">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-semibold ${methodStyle.bg} ${methodStyle.text}`}
          >
            {endpoint.method}
          </span>
          <code className="text-sm font-mono text-neutral-200">
            {endpoint.path}
          </code>
        </div>
        <p className="text-sm text-neutral-400">{endpoint.description}</p>
      </div>

      <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
        <div>
          {endpoint.requestBody && (
            <div className="border-b border-white/5">
              <div className="px-6 py-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                  Request Body
                </span>
              </div>
              <pre className="px-6 pb-4 overflow-x-auto text-[13px] leading-relaxed">
                <code className="font-mono text-neutral-300">
                  {endpoint.requestBody}
                </code>
              </pre>
            </div>
          )}
          <div>
            <div className="px-6 py-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                Response
              </span>
            </div>
            <pre className="px-6 pb-4 overflow-x-auto text-[13px] leading-relaxed">
              <code className="font-mono" style={{ color }}>
                {endpoint.responseBody}
              </code>
            </pre>
          </div>
        </div>

        <div>
          <div className="flex border-b border-white/5">
            <button
              onClick={() => setTab("curl")}
              className={`flex-1 px-4 py-3 text-xs font-mono uppercase tracking-widest transition-colors ${
                tab === "curl"
                  ? "text-[#7fffd4] border-b-2 border-[#7fffd4] bg-white/[0.02]"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              cURL
            </button>
            <button
              onClick={() => setTab("typescript")}
              className={`flex-1 px-4 py-3 text-xs font-mono uppercase tracking-widest transition-colors ${
                tab === "typescript"
                  ? "text-[#7fffd4] border-b-2 border-[#7fffd4] bg-white/[0.02]"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              TypeScript
            </button>
          </div>
          <CodeBlock
            code={tab === "curl" ? endpoint.curl : endpoint.typescript}
            language={tab === "curl" ? "bash" : "typescript"}
          />
        </div>
      </div>
    </div>
  );
}
