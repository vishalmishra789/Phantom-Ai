/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { type PromptState } from "../types";
import { Brain, Cpu, Layers, Image as ImageIcon, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

interface StrategyConfigProps {
  config: PromptState;
  setConfig: (config: PromptState) => void;
}

export default function StrategyConfig({ config, setConfig }: StrategyConfigProps) {
  const toggle = (key: keyof PromptState) => {
    setConfig({ ...config, [key]: !config[key] });
  };

  const strategies = [
    {
      id: 'isExpertEnabled',
      name: 'Expert Architect',
      description: 'Senior Consultant persona with analysis phase',
      icon: Brain,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    {
      id: 'isCotEnabled',
      name: 'Chain of Thought',
      description: 'Forces deep reasoning and edge case analysis',
      icon: Layers,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
      border: 'border-purple-200'
    },
    {
      id: 'isFewShotEnabled',
      name: 'Few-Shot Learning',
      description: 'Teaches style via perfect interaction examples',
      icon: Cpu,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200'
    },
    {
      id: 'isMultimodalEnabled',
      name: 'Vision Auditor',
      description: 'Multimodal analysis for OCR and UI reviews',
      icon: ImageIcon,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
      border: 'border-orange-200'
    },
    {
      id: 'isImageGenEnabled',
      name: 'Phantom Imaginator',
      description: 'Generates high-quality images from text prompts',
      icon: Sparkles,
      color: 'text-pink-500',
      bg: 'bg-pink-50',
      border: 'border-pink-200'
    }
  ];

  return (
    <div className="flex flex-col gap-4 p-6 border-r border-gray-100 bg-white h-full w-full max-w-xs shrink-0 overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Phantom AI Labs</h2>
        <p className="text-sm text-gray-500 mt-1">Configure the Meta Prompt layer</p>
      </div>

      <div className="space-y-3">
        {strategies.map((s) => (
          <button
            key={s.id}
            onClick={() => toggle(s.id as keyof PromptState)}
            className={cn(
              "w-full text-left p-4 rounded-xl border transition-all duration-200 hover:shadow-md",
              config[s.id as keyof PromptState] 
                ? cn(s.bg, s.border, "shadow-sm translate-x-1") 
                : "bg-white border-gray-100 hover:border-gray-200"
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn("p-2 rounded-lg bg-white shadow-sm", s.color)}>
                <s.icon size={20} />
              </div>
              <div>
                <div className="font-semibold text-gray-900">{s.name}</div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  {s.description}
                </p>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
               <div className={cn(
                 "w-8 h-4 rounded-full relative transition-colors",
                 config[s.id as keyof PromptState] ? "bg-blue-500" : "bg-gray-200"
               )}>
                 <motion.div 
                   animate={{ x: config[s.id as keyof PromptState] ? 16 : 2 }}
                   className="absolute top-1 left-0 w-2 h-2 bg-white rounded-full shadow-sm"
                 />
               </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-gray-50">
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 italic text-xs text-gray-400">
           "The secret to Top Notch AI isn't just code—it's the System Instruction."
        </div>
      </div>
    </div>
  );
}
