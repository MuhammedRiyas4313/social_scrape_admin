"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  text?: string
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="relative">
        <Loader2 className={cn(
          "animate-spin text-primary",
          sizeClasses[size],
          className
        )} />
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
      </div>
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}