/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { type ChatMessage, type PromptState } from "../types";
import { sendMessage } from "../lib/gemini";
import MessageList from "./MessageList";
import { Send, ImagePlus, X, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

interface ChatInterfaceProps {
  config: PromptState;
}

export default function ChatInterface({ config }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: 'Hello! I am configured with your current Strategy Labs setup. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      image: selectedImage?.data
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    const currentImage = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const response = await sendMessage(input, messages, config, currentImage || undefined);
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: response.text,
        image: response.image 
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: `### Error\n${error.message || "Failed to get a response from Gemini. Please ensure your API key is correctly configured."}\n\n*Check the console for more details.*` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setSelectedImage({
          data: base64String,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 flex-1 relative">
      {/* Scrollable area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-6"
      >
        <MessageList messages={messages} />
        {isLoading && (
          <div className="flex gap-4 max-w-3xl">
             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
               <Loader2 size={16} className="text-blue-600 animate-spin" />
             </div>
             <div className="p-4 rounded-2xl bg-white border border-gray-100 text-gray-500 animate-pulse">
                Thinking...
             </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-6 bg-white border-t border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto">
          {selectedImage && (
            <div className="mb-4 relative inline-block">
              <img 
                src={`data:${selectedImage.mimeType};base64,${selectedImage.data}`} 
                alt="Selected" 
                className="h-24 w-auto rounded-lg border border-gray-200 shadow-sm"
              />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600"
              >
                <X size={12} />
              </button>
            </div>
          )}
          
          <div className="flex items-end gap-3 bg-gray-50 rounded-2xl p-2 border border-gray-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 text-gray-400 hover:text-blue-500 hover:bg-white rounded-xl transition-all"
            >
              <ImagePlus size={22} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload}
            />
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={config.isMultimodalEnabled ? "Upload an image and ask for a UI audit..." : "Type your message..."}
              className="flex-1 bg-transparent border-none focus:ring-0 py-2.5 text-gray-800 placeholder:text-gray-400 resize-none max-h-40"
              rows={1}
            />
            
            <button
              onClick={handleSend}
              disabled={(!input.trim() && !selectedImage) || isLoading}
              className={cn(
                "p-2.5 rounded-xl transition-all",
                input.trim() || selectedImage 
                  ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            Leveraging Gemini 1.5 with {Object.values(config).filter(Boolean).length} meta-strategies active.
          </p>
        </div>
      </div>
    </div>
  );
}
