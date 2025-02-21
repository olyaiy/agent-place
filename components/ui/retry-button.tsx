"use client"

import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RetryButtonProps {
  onClick: () => void
}

export function RetryButton({ onClick }: RetryButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-6 w-6"
      aria-label="Retry"
      onClick={onClick}
    >
      <RefreshCw className="h-4 w-4 transition-transform ease-in-out" />
      <span className="sr-only">Retry</span>
    </Button>
  )
}
