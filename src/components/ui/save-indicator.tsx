"use client";

import { cn } from "@/lib/utils";

interface SaveIndicatorProps {
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  className?: string;
}

export function SaveIndicator({
  isSaving,
  hasUnsavedChanges,
  className,
}: SaveIndicatorProps) {
  return (
    <div
      className={cn("flex items-center gap-2 text-sm font-medium", className)}
    >
      <div
        className={cn(
          "h-2 w-2 rounded-full",
          isSaving
            ? "bg-yellow-400"
            : hasUnsavedChanges
            ? "bg-red-400"
            : "bg-green-400"
        )}
      />
      <span className="text-muted-foreground">
        {isSaving
          ? "Saving changes..."
          : hasUnsavedChanges
          ? "Unsaved changes"
          : "All changes saved"}
      </span>
    </div>
  );
}
