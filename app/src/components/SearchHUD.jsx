import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, CornerDownLeft } from 'lucide-react';
import { soundEffects } from '../utils/audio';

export default function SearchHUD({
  isOpen,
  onOpen,
  onClose,
  terms,
  categories,
  searchQuery,
  onSearchChange,
  onSelectTerm,
  soundEnabled,
  isDark
}) {
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef(null);

  // Global hotkey '/' or 'Cmd+K' / 'Ctrl+K' to open search
  useEffect(() => {
    function handleGlobalKeyDown(e) {
      if ((e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') ||
          ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        onOpen();
        soundEffects.toggle(soundEnabled);
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [onOpen, soundEnabled]);

  // Focus input automatically when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [isOpen]);

  // Suggested terms when input is empty
  const defaultSuggestions = useMemo(() => {
    const popularIds = ['function', 'pure-function', 'currying', 'functor', 'monad', 'partial-function'];
    return terms.filter(t => popularIds.includes(t.id));
  }, [terms]);

  // Filtered terms matching query, ranked by relevance
  const filteredTerms = useMemo(() => {
    if (!searchQuery.trim()) return defaultSuggestions;
    const q = searchQuery.toLowerCase().trim();
    
    const scored = [];
    for (const t of terms) {
      const lowerTitle = t.title.toLowerCase();
      let score = 0;
      if (lowerTitle === q || t.id === q) {
        score = 100;
      } else if (lowerTitle.startsWith(q) || t.id.startsWith(q)) {
        score = 80;
      } else if (lowerTitle.includes(q) || t.id.includes(q)) {
        score = 60;
      } else if (t.aliases && t.aliases.some(a => a.toLowerCase().includes(q))) {
        score = 40;
      } else if (categories[t.category]?.name.toLowerCase().includes(q)) {
        score = 30;
      } else if (t.summary && t.summary.toLowerCase().includes(q)) {
        score = 20;
      } else if (t.codeBlocks && t.codeBlocks.some(cb => cb.code.toLowerCase().includes(q))) {
        score = 10;
      }

      if (score > 0) {
        scored.push({ term: t, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.map(s => s.term).slice(0, 8);
  }, [terms, categories, searchQuery, defaultSuggestions]);

  // Reset highlight when list changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredTerms]);

  // Handle keyboard navigation in search results
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }

    if (filteredTerms.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev + 1) % filteredTerms.length);
      soundEffects.hover(soundEnabled);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev - 1 + filteredTerms.length) % filteredTerms.length);
      soundEffects.hover(soundEnabled);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredTerms[highlightedIndex];
      if (selected) {
        onSelectTerm(selected.id);
        soundEffects.select(soundEnabled);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 bg-black/60 backdrop-blur-sm font-mono animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-xl border shadow-2xl overflow-hidden flex flex-col max-h-[80vh] ${
          isDark
            ? 'bg-[#141414] border-[rgba(240,240,238,0.18)] text-[#f0f0ee]'
            : 'bg-[#eaeae8] border-[rgba(26,26,25,0.18)] text-[#1a1a19]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className={`relative flex items-center border-b px-3.5 py-2.5 ${
          isDark ? 'border-[rgba(240,240,238,0.12)] bg-[#1a1a19]' : 'border-[rgba(26,26,25,0.12)] bg-[#dededb]'
        }`}>
          <Search className={`w-4 h-4 shrink-0 mr-3 ${isDark ? 'text-[#f0f0ee]/50' : 'text-[#1a1a19]/50'}`} />
          <input
            ref={inputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Search ${terms.length} concepts, aliases, or code...`}
            className="w-full bg-transparent text-xs tracking-tight focus:outline-none placeholder:opacity-40"
          />

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className={`p-1 transition ${
                  isDark ? 'text-[#f0f0ee]/50 hover:text-[#f0f0ee]' : 'text-[#1a1a19]/50 hover:text-[#1a1a19]'
                }`}
                title="Clear query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className={`px-1.5 py-0.5 text-[10px] border transition ${
                isDark ? 'border-[rgba(240,240,238,0.15)] opacity-60 hover:opacity-100 hover:bg-[#20201e]' : 'border-[rgba(26,26,25,0.15)] opacity-60 hover:opacity-100 hover:bg-[#dcdcd9]'
              }`}
              title="Close [Esc]"
            >
              [ Esc ]
            </button>
          </div>
        </div>

        {/* Results / Suggestions Header */}
        <div className={`px-3.5 py-1.5 text-[10px] uppercase tracking-widest border-b flex items-center justify-between opacity-60 ${
          isDark ? 'border-[rgba(240,240,238,0.08)] bg-[#141414]' : 'border-[rgba(26,26,25,0.08)] bg-[#e2e2df]'
        }`}>
          <span>
            {searchQuery.trim() ? `Results (${filteredTerms.length})` : 'Popular Suggestions'}
          </span>
          <span>[ ↑↓ ] navigate · [ ↵ ] select</span>
        </div>

        {/* Scrollable Results List */}
        <div className="overflow-y-auto divide-y divide-[rgba(240,240,238,0.06)] dark:divide-[rgba(240,240,238,0.06)] divide-[rgba(26,26,25,0.06)]">
          {filteredTerms.length > 0 ? (
            filteredTerms.map((term, index) => {
              const isHighlighted = index === highlightedIndex;
              const cat = categories[term.category];
              return (
                <div
                  key={term.id}
                  onClick={() => {
                    onSelectTerm(term.id);
                    soundEffects.select(soundEnabled);
                    onClose();
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`px-3.5 py-2.5 cursor-pointer flex items-center justify-between transition-colors duration-100 ${
                    isHighlighted
                      ? (isDark ? 'bg-[#222220] text-[#f0f0ee]' : 'bg-[#dededb] text-[#1a1a19]')
                      : (isDark ? 'hover:bg-[#1c1c1a]' : 'hover:bg-[#e4e4e1]')
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs tracking-tight">
                        {term.title}
                      </span>
                      <span
                        className="text-[9px] px-1.5 py-0.2 border"
                        style={{
                          borderColor: `${cat?.color || '#94a3b8'}40`,
                          color: cat?.color || '#94a3b8',
                          backgroundColor: `${cat?.color || '#94a3b8'}12`
                        }}
                      >
                        {cat?.name}
                      </span>
                    </div>
                    <p className="text-[11px] truncate mt-0.5 opacity-70">
                      {term.summary}
                    </p>
                  </div>

                  {isHighlighted && (
                    <CornerDownLeft className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs opacity-50">
              No functional programming concepts match "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
