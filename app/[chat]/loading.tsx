import { MessageInput } from "@/components/ui/message-input"

export default function Loading() {
     return (
      <div className="container h-full flex flex-col justify-center items-center  max-auto justify-self-center">
      <div className="flex flex-col w-full max-w-3xl mb-60">
      {/* <h1 className="text-2xl font-bold mb-8 text-center">{"agentName"}</h1> */}
      <div className="w-full py-4 flex items-center justify-center">
      <div className="w-1/3 h-10 animate-pulse rounded bg-muted" />

      </div>
      
      <div className="flex-1" />
      <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <MessageInput
            value={" "}
            isGenerating={true}
            className="max-w-3xl mx-auto"
          />
      </div>
    </div>
    </div>
     )
   
  }
  