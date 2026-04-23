/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { type ChatMessage } from "../types";
import MarkdownView from "./MarkdownView";
import { User, Bot } from "lucide-react";
import { cn } from "../lib/utils";

interface MessageListProps {
  messages: ChatMessage[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {messages.map((m, i) => (
        <div 
          key={i} 
          className={cn(
            "flex gap-4 group",
            m.role === 'user' ? "flex-row-reverse" : "flex-row"
          )}
        >
          <div className={cn(
            "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105",
            m.role === 'user' ? "bg-blue-600 text-white" : "bg-white border border-gray-100 text-blue-600"
          )}>
            {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
          </div>
          
          <div className={cn(
            "flex-1 space-y-4 max-w-[85%]",
            m.role === 'user' ? "text-right" : "text-left"
          )}>
            {m.image && (
              <div className={cn(
                "rounded-2xl overflow-hidden border border-gray-100 shadow-sm inline-block",
                m.role === 'user' ? "ml-auto" : "mr-auto"
              )}>
                <img 
                  src={`data:image/png;base64,${m.image}`} 
                  alt="Uploaded context" 
                  className="max-h-64 h-auto w-auto object-cover"
                />
              </div>
            )}
            
            <div className={cn(
              "p-5 rounded-3xl shadow-sm text-sm leading-relaxed",
              m.role === 'user' 
                ? "bg-blue-600 text-white rounded-tr-none" 
                : "bg-white border border-gray-100 text-gray-800 rounded-tl-none font-sans"
            )}>
              {m.role === 'model' ? (
                <div className="markdown-body">
                   <MarkdownView content={m.content} />
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{m.content}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
