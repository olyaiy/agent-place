'use client';

import { useState } from 'react';

import { readStreamableValue } from 'ai/rsc';
import { Message } from '@/app/[chat]/actions';
import { continueConversation } from '@/app/[chat]/actions';
import { MessageInput } from '@/components/ui/message-input';
import { MessageList } from "@/components/ui/message-list"
import { ChatContainer } from '@/components/ui/chat';



export default function Home({ 
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
        modelId,
        systemPrompt,
        chatId
      );

      let textContent = '';
      
      // Existing streaming handling remains the same
      for await (const delta of readStreamableValue(newMessage)) {
        textContent = `${textContent}${delta}`;
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

  return (
    <ChatContainer>

    <div className="flex flex-col h-full overflow-y-scroll">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto mt-auto">
          <MessageList
            messages={conversation}
            isTyping={isGenerating}
          />
        </div>
      </div>

      <div className="flex-none  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-0">
        <div className="max-w-3xl mx-auto bg-red-500 mt-atuo">

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
    </ChatContainer>
    
  );
}