/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import StrategyConfig from "./components/StrategyConfig";
import ChatInterface from "./components/ChatInterface";
import { type PromptState } from "./types";
import { Sparkles, Settings2 } from "lucide-react";

export default function App() {
  const [config, setConfig] = useState<PromptState>({
    isExpertEnabled: false,
    isCotEnabled: false,
    isFewShotEnabled: false,
    isMultimodalEnabled: false,
    isImageGenEnabled: false,
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-white font-sans text-slate-900 overflow-hidden">
      {/* Header Mobile Only */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <Sparkles className="text-blue-600" size={20} />
          <span className="font-bold tracking-tight">Phantom AI</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-50 rounded-lg"
        >
          <Settings2 size={20} />
        </button>
      </div>

      {/* Sidebar - Strategy Labs */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-40 h-full transition-transform duration-300 ease-in-out`}>
        <StrategyConfig config={config} setConfig={setConfig} />
      </div>

      {/* Main Content - Chat */}
      <main className="flex-1 flex flex-col min-w-0 pt-14 lg:pt-0">
        <ChatInterface config={config} />
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-30" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
