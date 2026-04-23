/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { type ChatMessage, type PromptState } from "../types";

// Prefer env variable, fallback to constant for user's manual export if needed
const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyC1R2xwyttKtHfqAfTeTzGMgrKshmrm_Wc";

const ai = new GoogleGenAI({ apiKey: API_KEY });

const EXPERT_SYSTEM_PROMPT = `You are a Senior Technical Consultant and Expert Polyglot Developer.

1. Analysis Phase: Before answering, briefly analyze the user's request in one sentence.
2. Reasoning: Use 'Chain of Thought' reasoning. If a task is complex, break it into numbered steps.
3. Code Standards: All code must be production-ready, TypeScript-first, and include brief comments for complex logic.
4. Tone: Be concise, professional, and objective. Avoid fluff like 'I hope this helps' or 'As an AI language model.'
5. Formatting: Use Markdown headers (###), bold text for key terms, and professional table structures for data comparison.`;

const FEW_SHOT_EXAMPLES = `
Example 1: User: 'Tell me about Apple.' AI: '### Apple Inc. Type: Technology Giant Key Products: iPhone, Mac, Services. 

Apple is known for its hardware-software integration...'

Example 2: User: 'Fix this code: console.log(x)' AI: '### Bug Fix The variable \`x\` is not defined. \`\`\`javascript const x = "Hello"; console.log(x); \`\`\`'

Now, respond to the user's next input using this exact professional formatting.`;

const MULTIMODAL_SYSTEM_PROMPT = `Act as an Optical Character Recognition (OCR) and Visual Analysis Expert.

1. Extract all text from this image.
2. Describe the visual layout and UI components (if any).
3. Suggest improvements based on modern design principles (Apple/Google Human Interface Guidelines).`;

function wrapCotMessage(message: string): string {
  return `
Analyze the following request deeply. 
First, explain the security implications. 
Second, provide the code. 
Third, suggest 3 edge cases to test.

Request: ${message}
`;
}

const IDENTITY_PROMPT = `Your name is Phantom. You were created and are owned by Vishal mishra. Respond naturally to questions about your name or owner based on this identity.`;

export async function sendMessage(
  message: string,
  history: ChatMessage[],
  config: PromptState,
  image?: { data: string; mimeType: string }
) {
  let systemInstruction = IDENTITY_PROMPT;
  const modelToUse = "gemini-3-flash-preview";

  if (config.isMultimodalEnabled && image) {
    systemInstruction += "\n\n" + MULTIMODAL_SYSTEM_PROMPT;
  } else {
    if (config.isExpertEnabled) {
      systemInstruction += "\n\n" + EXPERT_SYSTEM_PROMPT;
    }
    if (config.isFewShotEnabled) {
      systemInstruction += "\n\n" + FEW_SHOT_EXAMPLES;
    }
  }

  const finalMessage = config.isCotEnabled ? wrapCotMessage(message) : message;

  // Convert history to @google/genai format
  // The @google/genai SDK uses "user" and "model" roles
  const contents = history.map(m => ({
    role: m.role as "user" | "model",
    parts: [
      ...(m.image ? [{ inlineData: { data: m.image, mimeType: "image/png" } }] : []),
      { text: m.content }
    ]
  }));

  // Add current message
  const currentParts: any[] = [];
  if (image) {
    currentParts.push({
      inlineData: {
        data: image.data,
        mimeType: image.mimeType
      }
    });
  }
  currentParts.push({ text: finalMessage });
  
  contents.push({
    role: "user",
    parts: currentParts
  });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelToUse,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const textResult = response.text;
    
    // Check for multimodal output (base64 image)
    let base64Image = undefined;
    const candidates = (response as any).candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
        }
      }
    }

    return { 
      text: textResult || "No response received.", 
      image: base64Image
    };
  } catch (error) {
    console.error("Gemini API Error Detail:", error);
    throw error;
  }
}
