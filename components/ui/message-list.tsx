import {
  ChatMessage,
  type ChatMessageProps,
} from "@/components/ui/chat-message"
import { TypingIndicator } from "@/components/ui/typing-indicator"
import type { Message } from "@/app/[chat]/actions"
import { CopyButton } from "./copy-button"
import { DeleteButton } from "./delete-button"
import { RetryButton } from "./retry-button"
import { EditButton } from "./edit-button"

type AdditionalMessageOptions = Omit<ChatMessageProps, keyof Message>

interface MessageListProps {
  messages: Message[]
  showTimeStamps?: boolean
  isTyping?: boolean
  onDeleteMessage?: (messageId: string) => void
  onRetryMessage?: (messageId: string) => void   // <-- new prop
  onEditMessage?: (messageId: string, oldContent: string) => void;  // <--- new


  messageOptions?:
    | AdditionalMessageOptions
    | ((message: Message) => AdditionalMessageOptions)
}

export function MessageList({
  messages,
  showTimeStamps = true,
  isTyping = false,
  messageOptions,
  onDeleteMessage,
  onRetryMessage,
  onEditMessage,
}: MessageListProps) {
  
  return (
    <div className="space-y-4 overflow-visible">
      {messages.map((message, index) => {
        const additionalOptions =
          typeof messageOptions === "function"
            ? messageOptions(message)
            : messageOptions;

        return (
          <ChatMessage
          key={index}
            showTimeStamp={showTimeStamps}
            // Pass the copy button as the action.
            actions={
              <>
                <CopyButton
                  content={message.content}
                  copyMessage="Copied message to clipboard!"
                />
                {onDeleteMessage && (
                  <DeleteButton
                    onClick={() => onDeleteMessage(message.id)}
                  />
                
                )}

              {onRetryMessage && message.role === "assistant" && (
                  <RetryButton
                    onClick={() => onRetryMessage(message.id)}
                  />
                )}


{onEditMessage && (
                  <EditButton
                    onClick={() => onEditMessage(message.id, message.content)} 
                  />
                )}
              </>
            }

            
            {...message}
            {...additionalOptions}
          />
        );
      })}
      {isTyping && <TypingIndicator />}
    </div>
  );
}
