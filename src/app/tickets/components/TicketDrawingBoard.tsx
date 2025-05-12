"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { DrawingEditor } from "./DrawingEditor";
import { TLEditorSnapshot } from "tldraw";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

interface TicketDrawingBoardProps {
  ticketId: string;
  className?: string;
  initialDrawing: TLEditorSnapshot | null;
  fullHeight?: boolean;
}

export const TicketDrawingBoard = forwardRef<
  { saveDrawing: () => void },
  TicketDrawingBoardProps
>(
  (
    { ticketId, className, initialDrawing, fullHeight = false },
    ref
  ) => {
    // Create a ref to store the drawing editor instance
    const drawingEditorRef = useRef<{ saveDrawing: () => void } | null>(null);

    // Expose the saveDrawing method to the parent component
    useImperativeHandle(ref, () => ({
      saveDrawing: () => {
        if (drawingEditorRef.current) {
          drawingEditorRef.current.saveDrawing();
        }
      },
    }));

    return (
      <div
        className={cn("relative w-full ", className)}
        style={fullHeight ? {height: '100%'}: { height: "80vh" }}
      >
        <Tldraw
          className="h-full w-full"
          components={{
            PageMenu: null,
            NavigationPanel: null,
            MainMenu: null,
          }}
        >
          <DrawingEditor
            ticketId={ticketId}
            initialDrawing={initialDrawing}
            ref={drawingEditorRef}
          />
        </Tldraw>
      </div>
    );
  }
);
