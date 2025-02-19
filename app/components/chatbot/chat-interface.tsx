'use client';

import { useState } from 'react';

import { readStreamableValue } from 'ai/rsc';
import { Message } from '@/app/[chat]/actions';
import { continueConversation } from '@/app/[chat]/actions';
import { MessageInput } from '@/components/ui/message-input';
import { MessageList } from "@/components/ui/message-list"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function Home({ providerId, modelId }: { providerId: string; modelId: string }) {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSend = async () => {
    setIsGenerating(true);
    try {
      const { messages, newMessage } = await continueConversation(
        [...conversation, { role: 'user', content: input }],
        providerId,
        modelId
      );

      let textContent = '';
      setInput('');

      for await (const delta of readStreamableValue(newMessage)) {
        textContent = `${textContent}${delta}`;
        setConversation([
          ...messages,
          { role: 'assistant', content: textContent },
        ]);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <MessageList
        messages={conversation}
        isTyping={isGenerating}
      />

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
        />
      </form>
    </div>
  );
}