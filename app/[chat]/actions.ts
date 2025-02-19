'use server';

import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from 'ai/rsc';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export async function continueConversation(
  history: Message[],
  providerId: string,
  modelId: string,
  systemPrompt: string
) {
  'use server';

  const providers = {
    openai,
    // Add other providers as needed
  };

  const providerFn = providers[providerId as keyof typeof providers];
  if (!providerFn) {
    throw new Error(`Invalid provider: ${providerId}`);
  }

  const stream = createStreamableValue();

  (async () => {
    const { textStream } = await streamText({
      model: providerFn(modelId),
      system: systemPrompt,
      messages: history,
    });

    for await (const text of textStream) {
      stream.update(text);
    }

    stream.done();
  })();

  console.log(modelId);
  console.log(providerId);
  return {
    messages: history,
    newMessage: stream.value,
  };
}