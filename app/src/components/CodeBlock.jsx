import React, { useState, useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import { Check, Copy } from 'lucide-react';
import { soundEffects } from '../utils/audio';

export default function CodeBlock({
  code,
  language = 'javascript',
  isDark = true,
  soundEnabled = true,
  showLineNumbers = true
}) {
  const [copied, setCopied] = useState(false);

  // Memoize highlighted code HTML
  const highlightedHtml = useMemo(() => {
    try {
      const grammar = Prism.languages[language] || Prism.languages.javascript;
      return Prism.highlight(code.trim(), grammar, language);
    } catch {
      return code;
    }
  }, [code, language]);

  // Split lines for line numbers
  const lines = useMemo(() => {
    return code.trim().split('\n');
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    soundEffects.toggle(soundEnabled);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative overflow-hidden border transition-colors font-mono ${
      isDark
        ? 'bg-[#0e0e0e] border-[rgba(240,240,238,0.15)] shadow-lg'
        : 'bg-[#f4f4f2] border-[rgba(26,26,25,0.15)] shadow-md'
    }`}>
      {/* Editor Header Bar */}
      <div className={`flex items-center justify-between px-3 py-1.5 border-b text-xs select-none ${
        isDark ? 'bg-[#181817] border-[rgba(240,240,238,0.1)] text-[#f0f0ee]/70' : 'bg-[#dfdfdc] border-[rgba(26,26,25,0.1)] text-[#1a1a19]/70'
      }`}>
        <div className="flex items-center gap-2">
          {/* Subtle status dot */}
          <span className="w-2 h-2 rounded-full border border-current opacity-40" />
          <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
            {language === 'javascript' ? 'JavaScript' : language}
          </span>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1 px-2 py-0.5 text-[10px] transition border ${
            isDark
              ? 'text-[#f0f0ee]/80 hover:text-[#f0f0ee] bg-[#121212] hover:bg-[#20201e] border-[rgba(240,240,238,0.15)]'
              : 'text-[#1a1a19]/80 hover:text-[#1a1a19] bg-[#eaeae8] hover:bg-[#dcdcd9] border-[rgba(26,26,25,0.15)]'
          }`}
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 opacity-70" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Editor Body */}
      <div className="overflow-x-auto p-3.5 flex font-mono text-xs leading-relaxed">
        {showLineNumbers && (
          <div className={`select-none pr-3.5 mr-3.5 text-right border-r font-mono text-[11px] leading-relaxed opacity-40 ${
            isDark ? 'border-[rgba(240,240,238,0.1)]' : 'border-[rgba(26,26,25,0.1)]'
          }`}>
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}

        <pre className={`flex-1 m-0 p-0 font-mono text-xs leading-relaxed overflow-visible ${
          isDark ? 'text-[#f0f0ee]' : 'text-[#1a1a19]'
        }`}>
          <code
            className="language-javascript font-mono"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </pre>
      </div>
    </div>
  );
}
