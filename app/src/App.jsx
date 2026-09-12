import React, { useState, useEffect, useMemo } from 'react';
import jargonsData from './data/jargons.json';
import GraphCanvas from './components/GraphCanvas';
import SearchHUD from './components/SearchHUD';
import NodeDetailPanel from './components/NodeDetailPanel';
import { soundEffects } from './utils/audio';
import {
  Search,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Shuffle
} from 'lucide-react';
import { GithubIcon } from './components/Icons';

export default function App() {
  const { meta, categories, terms, graph } = jargonsData;
  
  // Highlighted node on the graph (Partial function on initial load)
  const [selectedNodeId, setSelectedNodeId] = useState('partial-function');

  // Sidebar detail panel: strictly closed on load
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Command palette search modal
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Customization toggles
  const [useCategoryColors] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Initialize theme from localStorage or system preference
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fp_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // Map of terms by id for instant lookup
  const allTermsMap = useMemo(() => {
    const map = {};
    terms.forEach(t => { map[t.id] = t; });
    return map;
  }, [terms]);

  // Clean up any lingering hash from previous reloads and handle navigation
  useEffect(() => {
    // If the browser loaded with lingering default hash, clean it so the sidebar stays closed
    if (window.location.hash === '#pure-function' || window.location.hash === '#partial-function') {
      window.history.replaceState(null, '', window.location.pathname);
    }

    const handleHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash && allTermsMap[hash]) {
        setSelectedNodeId(hash);
        setIsPanelOpen(true);
      } else if (!hash) {
        setIsPanelOpen(false);
      }
    };

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [allTermsMap]);

  // Update hash when a node is selected
  const handleSelectNode = (nodeId) => {
    setSelectedNodeId(nodeId);
    if (nodeId) {
      setIsPanelOpen(true);
      window.history.replaceState(null, '', `#${nodeId}`);
    } else {
      setIsPanelOpen(false);
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  // Close drawer
  const handleClosePanel = () => {
    setIsPanelOpen(false);
    window.history.replaceState(null, '', window.location.pathname);
  };

  // Pick random term
  const handleRandomTerm = () => {
    const randomTerm = terms[Math.floor(Math.random() * terms.length)];
    if (randomTerm) {
      handleSelectNode(randomTerm.id);
      soundEffects.select(soundEnabled);
    }
  };

  // Sync dark class on document root and persist
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('fp_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('fp_theme', 'light');
    }
  }, [isDark]);

  // Keyboard shortcut: Esc to close panel or search modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isSearchOpen) {
          setIsSearchOpen(false);
        } else if (isPanelOpen) {
          handleClosePanel();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, isPanelOpen]);

  const activeTerm = (selectedNodeId && isPanelOpen) ? allTermsMap[selectedNodeId] : null;

  return (
    <div className={`relative w-screen h-screen overflow-hidden flex flex-col font-mono transition-colors duration-200 ${
      isDark ? 'bg-[#121212] text-[#f0f0ee]' : 'bg-[#eaeae8] text-[#1a1a19]'
    }`}>
      {/* Subtle Background Grid */}
      <div className={`absolute inset-0 pointer-events-none ${
        isDark ? 'bg-grid-dark opacity-60' : 'bg-grid-light opacity-70'
      }`} />

      {/* Floating Transparent Header (No solid bar, fully transparent background & borderless) */}
      <header className="relative z-30 px-4 sm:px-6 py-3 bg-transparent border-none flex items-center justify-between gap-4 pointer-events-auto">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div className={`w-7 h-7 border flex items-center justify-center font-mono font-bold text-sm shadow-sm ${
            isDark
              ? 'bg-[#1a1a19] border-[rgba(240,240,238,0.2)] text-[#f0f0ee]'
              : 'bg-[#eaeae8] border-[rgba(26,26,25,0.2)] text-[#1a1a19]'
          }`}>
            λ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-bold tracking-tight">
                FP Jargon
              </h1>
              <span className={`hidden md:inline-block text-[9px] uppercase tracking-wider px-1.5 py-0.2 border ${
                isDark
                  ? 'bg-[#1a1a19] text-[#f0f0ee]/70 border-[rgba(240,240,238,0.15)]'
                  : 'bg-[#eaeae8] text-[#1a1a19]/70 border-[rgba(26,26,25,0.15)]'
              }`}>
                57 Terms
              </span>
            </div>
            <p className="hidden sm:block text-[10px] opacity-60">
              {meta.totalTerms} concepts · {meta.totalRelationships} relationships
            </p>
          </div>
        </div>

        {/* Right Toolbar Controls */}
        <div className="flex items-center gap-1.5 text-xs">
          {/* Tiny Search Button */}
          <button
            onClick={() => {
              setIsSearchOpen(true);
              soundEffects.toggle(soundEnabled);
            }}
            title="Search concepts [/ or ⌘K]"
            aria-label="Search concepts"
            className={`flex items-center gap-1 px-2 py-1 border backdrop-blur-md transition ${
              isDark
                ? 'bg-[#1a1a19]/90 hover:bg-[#222220] text-[#f0f0ee]/80 hover:text-[#f0f0ee] border-[rgba(240,240,238,0.15)]'
                : 'bg-[#eaeae8]/95 hover:bg-[#dededb] text-[#1a1a19]/80 hover:text-[#1a1a19] border-[rgba(26,26,25,0.15)]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px] opacity-50 font-mono">/</span>
          </button>

          {/* Random / Surprise Me */}
          <button
            onClick={handleRandomTerm}
            title="Pick a random concept"
            aria-label="Pick a random concept"
            className={`p-1.5 border backdrop-blur-md transition ${
              isDark
                ? 'bg-[#1a1a19]/90 hover:bg-[#222220] text-[#f0f0ee]/80 hover:text-[#f0f0ee] border-[rgba(240,240,238,0.15)]'
                : 'bg-[#eaeae8]/95 hover:bg-[#dededb] text-[#1a1a19]/80 hover:text-[#1a1a19] border-[rgba(26,26,25,0.15)]'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(prev => !prev);
              soundEffects.toggle(!soundEnabled);
            }}
            title={soundEnabled ? "Mute sound" : "Enable sound"}
            aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
            className={`p-1.5 border backdrop-blur-md transition ${
              isDark
                ? 'bg-[#1a1a19]/90 hover:bg-[#222220] text-[#f0f0ee]/80 hover:text-[#f0f0ee] border-[rgba(240,240,238,0.15)]'
                : 'bg-[#eaeae8]/95 hover:bg-[#dededb] text-[#1a1a19]/80 hover:text-[#1a1a19] border-[rgba(26,26,25,0.15)]'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 opacity-40" />}
          </button>

          {/* Prominent Light & Dark Toggle */}
          <button
            onClick={() => {
              setIsDark(prev => !prev);
              soundEffects.toggle(soundEnabled);
            }}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={`flex items-center gap-1.5 px-2.5 py-1 border backdrop-blur-md transition ${
              isDark
                ? 'bg-[#1a1a19]/90 hover:bg-[#222220] text-amber-300 border-[rgba(240,240,238,0.15)]'
                : 'bg-[#eaeae8]/95 hover:bg-[#dededb] text-indigo-700 border-[rgba(26,26,25,0.15)]'
            }`}
          >
            {isDark ? (
              <>
                <Sun className="w-3 h-3" />
                <span className="hidden sm:inline text-[11px]">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3 h-3" />
                <span className="hidden sm:inline text-[11px]">Dark</span>
              </>
            )}
          </button>

          {/* GitHub Repo Link */}
          <a
            href="https://github.com/hemanth/functional-programming-jargon"
            target="_blank"
            rel="noopener noreferrer"
            title="View on GitHub"
            aria-label="View on GitHub"
            className={`p-1.5 border backdrop-blur-md transition ${
              isDark
                ? 'bg-[#1a1a19]/90 hover:bg-[#222220] text-[#f0f0ee]/80 hover:text-[#f0f0ee] border-[rgba(240,240,238,0.15)]'
                : 'bg-[#eaeae8]/95 hover:bg-[#dededb] text-[#1a1a19]/80 hover:text-[#1a1a19] border-[rgba(26,26,25,0.15)]'
            }`}
          >
            <GithubIcon className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Main Experience: Interactive Knowledge Graph */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        <GraphCanvas
          graphData={graph}
          categories={categories}
          selectedNodeId={selectedNodeId}
          onSelectNode={handleSelectNode}
          searchQuery={searchQuery}
          useCategoryColors={useCategoryColors}
          soundEnabled={soundEnabled}
          isDark={isDark}
          isPanelOpen={isPanelOpen}
        />
      </main>

      {/* Slideover Detail Drawer */}
      {activeTerm && (
        <NodeDetailPanel
          term={activeTerm}
          categories={categories}
          allTermsMap={allTermsMap}
          onSelectTerm={handleSelectNode}
          onClose={handleClosePanel}
          soundEnabled={soundEnabled}
          useCategoryColors={useCategoryColors}
          isDark={isDark}
        />
      )}

      {/* Command Palette Search Modal */}
      <SearchHUD
        isOpen={isSearchOpen}
        onOpen={() => setIsSearchOpen(true)}
        onClose={() => setIsSearchOpen(false)}
        terms={terms}
        categories={categories}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectTerm={handleSelectNode}
        soundEnabled={soundEnabled}
        isDark={isDark}
      />
    </div>
  );
}
