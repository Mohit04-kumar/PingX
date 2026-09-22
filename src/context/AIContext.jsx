import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_AI_MESSAGES } from '../data/mockAIHistory';
import { generateAIResponse } from '../services/aiProvider';
import { generateId } from '../utils/formatters';

const AIContext = createContext();

export function AIContextContainer({ children, activeTab, activeChat, activeProduct }) {
  const [isAIPopupOpen, setIsAIPopupOpen] = useState(false);
  const [isSpeechBubbleOpen, setIsSpeechBubbleOpen] = useState(true);
  const [aiMessages, setAiMessages] = useState(INITIAL_AI_MESSAGES);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Derive AI Context dynamically based on active screen & state
  let contextType = 'general';
  let contextItem = null;

  if (activeTab === 'chats' && activeChat) {
    if (activeChat.type === 'group') {
      contextType = 'group';
      contextItem = activeChat;
    } else {
      contextType = 'chat';
      contextItem = activeChat;
    }
  } else if (activeTab === 'shop') {
    if (activeProduct) {
      contextType = 'product';
      contextItem = activeProduct;
    } else {
      contextType = 'shop';
      contextItem = null;
    }
  }

  // Context-specific quick action prompts
  const getContextPrompts = () => {
    switch (contextType) {
      case 'chat':
        return [
          `Ask AI about chat with ${activeChat?.user?.name || 'user'}`,
          "Suggest a polite reply",
          "Check grammar",
          "Translate to Hindi"
        ];
      case 'group':
        return [
          `Summarize ${activeChat?.group?.name || 'this group'}`,
          "List decisions made today",
          "Extract pending action items",
          "Create a meeting reminder"
        ];
      case 'shop':
        return [
          "Compare headphones under ₹8,000",
          "Best laptop for coding under ₹90,000",
          "Find highest discount electronics",
          "Suggest budget wireless earbuds"
        ];
      case 'product':
        return [
          `Is ${activeProduct?.name || 'this'} worth buying?`,
          "Summarize key pros & cons",
          "Compare with alternatives",
          "Check price history recommendation"
        ];
      default:
        return [
          "💬 Ask anything",
          "✍️ Help me write a message",
          "📝 Summarize my day",
          "🛍️ Discover top gadgets"
        ];
    }
  };

  // Auto-hide initial speech bubble after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSpeechBubbleOpen(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const [aiMode, setAiMode] = useState('chatgpt'); // 'platform' (website queries) or 'chatgpt' (general chat/GPT)

  const sendAIMessage = async (userPrompt, imageBase64 = null) => {
    const trimmedPrompt = String(userPrompt || '').trim();
    if ((!trimmedPrompt && !imageBase64) || isAiLoading) return;

    const userMsg = {
      id: generateId('ai_user'),
      sender: 'user',
      content: trimmedPrompt || 'Analyze attached image',
      timestamp: 'Just now',
      image: imageBase64 || null
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setIsAiLoading(true);

    const aiMsgId = generateId('ai_bot');
    const placeholderMsg = {
      id: aiMsgId,
      sender: 'ai',
      content: 'Thinking...',
      timestamp: 'Just now',
      isStreaming: true
    };

    setAiMessages((prev) => [...prev, placeholderMsg]);

    try {
      await generateAIResponse({
        prompt: trimmedPrompt || 'Analyze attached image',
        imageBase64,
        mode: aiMode,
        contextType,
        contextItem,
        onChunk: (partialText) => {
          setAiMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId
                ? { ...msg, content: partialText, isStreaming: true }
                : msg
            )
          );
        }
      });
      setAiMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId ? { ...msg, isStreaming: false } : msg
        )
      );
    } catch (err) {
      console.error('AI Assistant error:', err);
      setAiMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? {
                ...msg,
                content: 'PingX AI is temporarily unavailable. Please try again.',
                isStreaming: false,
                isError: true
              }
            : msg
        )
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <AIContext.Provider value={{
      isAIPopupOpen,
      setIsAIPopupOpen,
      isSpeechBubbleOpen,
      setIsSpeechBubbleOpen,
      aiMessages,
      sendAIMessage,
      isAiLoading,
      contextType,
      contextItem,
      aiMode,
      setAiMode,
      contextPrompts: getContextPrompts()
    }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  return useContext(AIContext);
}
