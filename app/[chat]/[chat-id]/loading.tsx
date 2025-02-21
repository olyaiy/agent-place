export default function Loading() {
    return (
      <div className="flex flex-col h-full">
        {/* Top Navbar Skeleton */}
        <div className="flex-none border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 max-w-screen-2xl items-center">
            {/* Agent Name Placeholder */}
            <div className="ml-14 h-4 w-32 animate-pulse rounded bg-muted" />
            {/* Settings Icon Placeholder */}
            <div className="ml-auto mr-2 h-5 w-5 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
  
        {/* Chat Content Skeleton */}
        <div className="flex-1 overflow-hidden">
          <div className="p-4 space-y-3 max-w-3xl mx-auto">
            {/* Repeated blocks to simulate message bubbles */}
            <div className="w-2/3 h-14 animate-pulse rounded bg-muted" />
            <div className="ml-auto w-1/2 h-14 animate-pulse rounded bg-muted" />
            <div className="w-1/2 h-14 animate-pulse rounded bg-muted" />
            <div className="ml-auto w-2/5 h-14 animate-pulse rounded bg-muted" />
            <div className="w-3/5 h-14 animate-pulse rounded bg-muted" />
          </div>
        </div>
  
        {/* Message Input Skeleton */}
        <div className="flex-none bg-background/95 backdrop-blur p-4">
          <div className="max-w-3xl mx-auto">
            <div className="h-10 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }
  