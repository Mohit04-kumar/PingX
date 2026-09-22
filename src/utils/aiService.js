import { generateAIResponse } from '../services/aiProvider';

export async function processAIRequest({ prompt, imageBase64 = null, contextType = 'general', contextItem = null, onChunk = () => {} }) {
  return await generateAIResponse({ prompt, imageBase64, contextType, contextItem, onChunk });
}
