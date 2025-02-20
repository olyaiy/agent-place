'use server';

import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from 'ai/rsc';
import { deepseek } from '@ai-sdk/deepseek';
import { db } from "@/db/connection"
import { conversations, messages } from "@/db/schema/chat-schema"
import { eq, max } from 'drizzle-orm';

export interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  position: number;
  createdAt: Date;
}

export async function continueConversation(
  history: Message[],
  providerId: string,
  modelId: string,
  systemPrompt: string,
  conversationId: string
) {
  'use server';

  const providers = {
    openai,
    deepseek,
    // Add other providers as needed
  };

  const providerFn = providers[providerId as keyof typeof providers];
  if (!providerFn) {
    throw new Error(`Invalid provider: ${providerId}`);
  }

  const stream = createStreamableValue();

  (async () => {
    // Get current position
    const maxPosition = await db
      .select({ max: max(messages.position) })
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .then(r => r[0]?.max || 0);

    // Insert user message
    const userMessage = history[history.length - 1];
    await db.insert(messages).values({
      conversationId,
      role: userMessage.role,
      content: userMessage.content,
      position: maxPosition + 1,
      createdAt: new Date()
    });

    // Generate AI response
    const { textStream } = await streamText({
      model: providerFn(modelId),
      system: systemPrompt,
      messages: history
        .filter(m => ['user', 'assistant'].includes(m.role))
        .map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content || ''
        })),
    });

    let assistantContent = '';
    for await (const text of textStream) {
      assistantContent += text;
      stream.update(text);
    }

    // Insert assistant message
    await db.insert(messages).values({
      conversationId,
      role: 'assistant',
      content: assistantContent,
      position: maxPosition + 2,
      createdAt: new Date()
    });

    stream.done();
  })();

  console.log(modelId);
  console.log(providerId);
  return {
    messages: history,
    newMessage: stream.value,
  };
}

export async function createConversation(
  userId: string,
  agentName: string,
  messageContent: string,
  agentId: string
) {
  'use server'

 

  // Create conversation
  const [conversation] = await db.insert(conversations).values({
    userId,
    agentId: agentId,
  }).returning({ id: conversations.id })

  // Create initial message
  await db.insert(messages).values({
    conversationId: conversation.id,
    role: 'user',
    content: messageContent,
    position: 1
  })

  return conversation.id
}