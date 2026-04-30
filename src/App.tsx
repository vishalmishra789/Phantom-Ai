/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import StrategyConfig from "./components/StrategyConfig";
import ChatInterface from "./components/ChatInterface";
import { type PromptState } from "./types";
import { Sparkles, Settings2 } from "lucide-react";
import { cn } from "./lib/utils";

export default function App() {
  const [config, setConfig] = useState<PromptState>({
    isExpertEnabled: false,
    isCotEnabled: false,
    isFewShotEnabled: false,
    isMultimodalEnabled: false,
    isImageGenEnabled: false,
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on desktop resize to prevent overlay issues
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-screen h-[100dvh] bg-white font-sans text-slate-900 overflow-hidden relative">
      {/* Header Mobile Only */}
      <div className="lg:hidden h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 shrink-0 z-50">
        <div className="flex items-center gap-2">
          <Sparkles className="text-blue-600" size={20} />
          <span className="font-bold tracking-tight">Phantom AI</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
          aria-label="Toggle settings"
        >
          <Settings2 size={20} className={isSidebarOpen ? "text-blue-600" : "text-gray-500"} />
        </button>
      </div>

      {/* Sidebar - Strategy Labs */}
      <div className={cn(
        "fixed lg:relative z-40 h-full transition-all duration-300 ease-in-out bg-white shadow-2xl lg:shadow-none",
        isSidebarOpen ? 'translate-x-0 w-80' : '-translate-x-full lg:translate-x-0 w-80'
      )}>
        <StrategyConfig config={config} setConfig={setConfig} />
      </div>

      {/* Main Content - Chat */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <ChatInterface config={config} />
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] lg:hidden z-30 transition-opacity animate-in fade-in" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
