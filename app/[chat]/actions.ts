'use server';

import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from 'ai/rsc';
import { deepseek } from '@ai-sdk/deepseek';
import { db } from "@/db/connection"
import { conversations, messages } from "@/db/schema/chat-schema"
import { eq, max } from 'drizzle-orm';
import { anthropic } from '@ai-sdk/anthropic';
import { azure } from '@ai-sdk/azure';
import { bedrock } from '@ai-sdk/amazon-bedrock';
import { google } from '@ai-sdk/google';
import { groq } from '@ai-sdk/groq';
import { mistral } from '@ai-sdk/mistral';




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
    anthropic,
    google,
    bedrock,
    groq,
    azure,
    mistral,
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

  return await db.transaction(async (trx) => {
    // Create conversation
    const [conversation] = await trx.insert(conversations).values({
      userId,
      agentId,
      title: 'New Chat'
    }).returning({ id: conversations.id })

    // Create initial user message
    await trx.insert(messages).values({
      conversationId: conversation.id,
      role: 'user',
      content: messageContent,
      position: 1
    })

    return conversation.id
  })
}


export async function createConversationTitle(
  conversationId: string,
  initialMessage: string
) {


  const titlePrompt = `Generate a short descriptive conversation title for the following message: "${initialMessage}"`;

  // Create a streamable value to collect the title text.
  const stream = createStreamableValue();

  try {
    const { textStream } = streamText({
      model: openai('gpt-4o-mini'),
      prompt: titlePrompt,
    });

    let title = '';

    // Track progress as the stream comes in
    for await (const delta of textStream) {
      title += delta;
      stream.update(delta);
    }

    stream.done();

    // Clean up the title
    title = title.replace(/['"]/g, '');

    // Update the conversation record in the database
    const updateResult = await db.update(conversations)
      .set({ title: title.trim() })
      .where(eq(conversations.id, conversationId));

    return { title };

  } catch (error) {
    console.error("❌ An error occurred while generating the conversation title:", error);
    throw error; // Re-throw the error for higher-level handling if needed
  }
}

export async function deleteMessage(messageId: string) {
  "use server"

  // Delete the message record from the DB
  await db.delete(messages).where(eq(messages.id, messageId))
}



