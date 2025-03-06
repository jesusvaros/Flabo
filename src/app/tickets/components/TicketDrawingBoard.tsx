"use client";

import { Tldraw } from "tldraw";
import { useCallback } from "react";
import "tldraw/tldraw.css";

interface TicketDrawingBoardProps {
  // Add any props you might need
  className?: string;
}

export const TicketDrawingBoard = ({ className }: TicketDrawingBoardProps) => {
  // Handle mount event if needed
  const handleMount = useCallback(() => {
    console.log("Drawing board mounted");
  }, []);

  return (
    <div className={`w-full h-[400px] ${className || ""}`}>
      <Tldraw
        persistenceKey="ticket-drawing" // Used for local storage persistence
        onMount={handleMount}
      />
    </div>
  );
}; 