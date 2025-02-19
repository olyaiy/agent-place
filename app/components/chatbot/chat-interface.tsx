'use client';

import { useState } from 'react';

import { readStreamableValue } from 'ai/rsc';
import { Message } from '@/app/[chat]/actions';
import { continueConversation } from '@/app/[chat]/actions';
import { MessageInput } from '@/components/ui/message-input';
import { MessageList } from "@/components/ui/message-list"


export default function Home({ providerId, modelId }: { providerId: string; modelId: string }) {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSend = async () => {
    setIsGenerating(true);
    try {
      // Create new user message first
      const newUserMessage = { 
        id: Date.now().toString(), 
        role: 'user', 
        content: input 
      };
      
      // Update conversation state immediately
      setConversation(prev => [...prev, newUserMessage as Message]);
      setInput('');

      // Then process the AI response
      const { messages, newMessage } = await continueConversation(
        [...conversation, newUserMessage as Message],
        providerId,
        modelId
      );

      let textContent = '';
      
      // Existing streaming handling remains the same
      for await (const delta of readStreamableValue(newMessage)) {
        textContent = `${textContent}${delta}`;
        setConversation([
          ...messages,
          { id: Date.now().toString(), role: 'assistant', content: textContent },
        ]);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          <MessageList
            messages={conversation}
            isTyping={isGenerating}
          />
        </div>
      </div>

      <div className="flex-none border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={async (e) => {
            e.preventDefault();
            await handleSend();
          }}>
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
    </div>
  );
}