'use client';

import { useState, useEffect, useRef } from 'react';
import { readStreamableValue } from 'ai/rsc';
import { Message } from '@/app/[chat]/actions';
import { continueConversation } from '@/app/[chat]/actions';
import { MessageInput } from '@/components/ui/message-input';
import { MessageList } from "@/components/ui/message-list"
import { ChatContainer, ChatMessages } from '@/components/ui/chat';

export default function ChatInterface({ 
  providerId, 
  modelId,
  systemPrompt,
  initialMessages,
  chatId
}: { 
  providerId: string; 
  modelId: string;
  systemPrompt: string;
  initialMessages: Message[];
  chatId: string;
}) {
  const [conversation, setConversation] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  // Prevent multiple auto calls on mount
  const autoTriggered = useRef(false);

  const handleSend = async () => {
    setIsGenerating(true);
    try {
      // Create new user message manually
      const newUserMessage = { 
        id: Date.now().toString(), 
        role: 'user', 
        content: input 
      };

      setConversation(prev => [...prev, newUserMessage]);
      setInput('');

      // Then process the AI response
      const { messages, newMessage } = await continueConversation(
        [...conversation, newUserMessage],
        providerId,
        modelId,
        systemPrompt,
        chatId
      );

      let textContent = '';
      for await (const delta of readStreamableValue(newMessage)) {
        textContent += delta;
        setConversation([
          ...messages,
          { 
            id: Date.now().toString(), 
            role: 'assistant', 
            content: textContent,
            position: messages.length + 1,
            createdAt: new Date()
          },
        ]);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-trigger assistant response if only the initial user message is present
  useEffect(() => {
    if (conversation.length === 1 && conversation[0].role === 'user' && !autoTriggered.current) {
      autoTriggered.current = true; // ensure it's triggered only once
      (async () => {
        setIsGenerating(true);
        try {
          const { messages, newMessage } = await continueConversation(
            conversation,
            providerId,
            modelId,
            systemPrompt,
            chatId
          );
          let textContent = '';
          for await (const delta of readStreamableValue(newMessage)) {
            textContent += delta;
            setConversation([
              ...messages,
              { 
                id: Date.now().toString(), 
                role: 'assistant', 
                content: textContent,
                position: messages.length + 1,
                createdAt: new Date()
              },
            ]);
          }
        } finally {
          setIsGenerating(false);
        }
      })();
    }
  }, [conversation, providerId, modelId, systemPrompt, chatId]);

  return (
    <ChatContainer className="h-full">
      <ChatMessages messages={conversation}>
        <div className="max-w-3xl mx-auto mt-auto">
          <MessageList messages={conversation} isTyping={isGenerating} />
        </div>
      </ChatMessages>
      <div className="flex-none bg-background/95 backdrop-blur p-0">
        <div className="max-w-3xl mx-auto">
          <form 
            className="mt-auto"
            onSubmit={async (e) => {
              e.preventDefault();
              await handleSend();
            }}
          >
            <MessageInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              isGenerating={isGenerating}
              submitOnEnter
              allowAttachments={false}
              enableInterrupt={false}
              className="w-full"
            />
          </form>
        </div>
      </div>
    </ChatContainer>
  );
}
