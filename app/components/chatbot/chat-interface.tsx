'use client';

import { useState, useEffect, useRef } from 'react';
import { readStreamableValue } from 'ai/rsc';
import { continueConversation, createConversationTitle } from '@/app/[chat]/actions';
import { MessageInput } from '@/components/ui/message-input';
import { MessageList } from "@/components/ui/message-list";
import { ChatContainer, ChatMessages } from '@/components/ui/chat';
import { mutate } from 'swr';
import { authClient } from '@/lib/auth-client';

// Assuming your Drizzle Message type is imported like this:
// import type { Message } from '@/db/schema/chat-schema';

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
  




  const handleDeleteMessage = (index: number) => {
    setConversation(prev => {
      const newMessages = [...prev];
      newMessages.splice(index, 1); // remove message at this index
      return newMessages;
    });

    // If you also want to delete from the DB, you’d make an API call here,
    // e.g., await deleteMessageFromDB(conversation[index].id)
  };




  return (
    <ChatContainer className="h-full">
      <ChatMessages messages={conversation}>
        <div className="max-w-3xl mx-auto mt-auto">
          <MessageList 
          messages={conversation} 
          isTyping={isGenerating} 
          onDeleteMessage={handleDeleteMessage}
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
