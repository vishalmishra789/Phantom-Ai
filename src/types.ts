/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Strategy = 'expert' | 'cot' | 'few-shot' | 'multimodal';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  image?: string; // base64
  reasoning?: string; // For CoT display if we can separate it
}

export interface PromptState {
  isExpertEnabled: boolean;
  isCotEnabled: boolean;
  isFewShotEnabled: boolean;
  isMultimodalEnabled: boolean;
  isImageGenEnabled: boolean;
}
