'use client';

import { useState, useEffect, useRef } from 'react';
import { readStreamableValue } from 'ai/rsc';
import { continueConversation, createConversationTitle, deleteMessage } from '@/app/[chat]/actions';
import { MessageInput } from '@/components/ui/message-input';
import { MessageList } from "@/components/ui/message-list";
import { ChatContainer, ChatMessages } from '@/components/ui/chat';
import { mutate } from 'swr';
import { authClient } from '@/lib/auth-client';

// Assuming your Drizzle Message type is imported like this:
// import type { Message } from '@/db/schema/chat-schema';

export default function ChatInterface({ providerId, modelId, systemPrompt, initialMessages, chatId
}: { 
  providerId: string; 
  modelId: string;
  systemPrompt: string;
  initialMessages: any[]; // or use your Message type from Drizzle
  chatId: string;
}) {
  const [conversation, setConversation] = useState<any[]>(initialMessages);



  
  const [input, setInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  // Use a ref to ensure the auto-trigger happens only once.
  const autoTriggered = useRef(false);

const handleSend = async () => {
    setIsGenerating(true);
    try {
      // Create a new user message that our schema
      const newUserMessage = { 
        conversationId: chatId, // include if needed on the client
        role: 'user', 
        content: input,
        position: conversation.length + 1,
        createdAt: new Date(),
        tokensUsed: 0,
        metadata: {},
        updatedAt: new Date()
      };

      // Immediately update the conversation state
      setConversation(prev => [...prev, newUserMessage]);
      setInput('');

      // Process the AI response
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
        // Update the conversation with the assistant's response as it streams in.
        setConversation([
          ...messages,
          { 
            conversationId: chatId,
            role: 'assistant', 
            content: textContent,
            position: messages.length + 1,
            createdAt: new Date(),
            tokensUsed: 0,
            metadata: {},
            updatedAt: new Date()
          },
        ]);
      }

      
    } finally {
      setIsGenerating(false);
    }
  };







  // Automatically trigger the assistant response if there's only the initial user message
  useEffect(() => {
    if (
      conversation.length === 1 &&
      conversation[0].role === 'user' &&
      !autoTriggered.current
    ) {
      autoTriggered.current = true;
  
      // Trigger the title creation in the background.
      (async () => {
        await createConversationTitle(chatId, conversation[0].content);
        const { data: session, error } = await authClient.getSession()
        console.log('User ID:', session?.user?.id ?? 'No user ID found')


        
        mutate(`/api/conversations?userId=${session?.user?.id}`);

      })();
  
      // Continue with the assistant response generation as before.
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
                conversationId: chatId,
                role: 'assistant',
                content: textContent,
                position: messages.length + 1,
                createdAt: new Date(),
                tokensUsed: 0,
                metadata: {},
                updatedAt: new Date(),
              },
            ]);
          }
        } finally {
          setIsGenerating(false);
        }
      })();
    }
  }, [conversation, providerId, modelId, systemPrompt, chatId]);
  




  const handleDeleteMessage = async (messageId: string) => {
    // 1. Store the old state
    const oldConversation = conversation

    // 2. Optimistically remove the message from state
    setConversation(prev => prev.filter(m => m.id !== messageId))

    try {
      // 3. Server action to delete the message in DB
      await deleteMessage(messageId)
      // If successful, do nothing else — UI is already updated!
      
    } catch (error) {
      // If the server call fails, revert to the old state
      setConversation(oldConversation)
      console.error("Failed to delete message:", error)
    }
  }




  const handleRetryMessage = async (messageId: string) => {
    setIsGenerating(true);
    try {
      // Remove the old assistant message from the conversation state
      const updatedConversation = conversation.filter(m => m.id !== messageId);
      setConversation(updatedConversation);
  
      // Continue the conversation using the updated conversation history
      const { messages, newMessage } = await continueConversation(
        updatedConversation,
        providerId,
        modelId,
        systemPrompt,
        chatId
      );
  
      let textContent = '';
      for await (const delta of readStreamableValue(newMessage)) {
        textContent += delta;
        // Update the conversation with the new assistant message
        setConversation([
          ...messages,
          {
            conversationId: chatId,
            role: 'assistant',
            content: textContent,
            position: messages.length + 1,
            createdAt: new Date(),
            tokensUsed: 0,
            metadata: {},
            updatedAt: new Date(),
          },
        ]);
      }
    } finally {
      setIsGenerating(false);
    }
  };
  





  return (
    <ChatContainer className="h-full">
      <ChatMessages messages={conversation}>
        <div className="max-w-3xl mx-auto mt-auto">
          <MessageList 
          messages={conversation} 
          isTyping={isGenerating} 
          onDeleteMessage={handleDeleteMessage}
          onRetryMessage={handleRetryMessage}

          />
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
