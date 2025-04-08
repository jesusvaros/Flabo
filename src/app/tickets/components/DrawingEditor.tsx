"use client";

import { TLEditorSnapshot, useEditor, loadSnapshot, getSnapshot } from "tldraw";
import { forwardRef, useImperativeHandle, useEffect, useCallback } from "react";
import { useDrawingStorage } from "../hooks/use-drawing-storage";

interface DrawingEditorProps {
  ticketId: string;
  initialDrawing: TLEditorSnapshot | null;
  onCloseRequested: () => void;
}

export const DrawingEditor = forwardRef<
  { saveDrawing: () => void },
  DrawingEditorProps
>(({ ticketId, initialDrawing, onCloseRequested }, ref) => {
  // Get the editor instance directly
  const editor = useEditor();
  const { saveDrawing } = useDrawingStorage(ticketId);

  // Load the initial drawing when the component mounts
  useEffect(() => {
    if (editor && initialDrawing) {
      console.log(`Loading initial drawing for ticket ${ticketId}`);
      loadSnapshot(editor.store, initialDrawing);
    }
  }, [editor, initialDrawing, ticketId]);

  // Define the save drawing function for explicit saves
  const handleSaveDrawing = useCallback(() => {
    if (!editor) return;

    console.log(`Saving drawing for ticket ${ticketId}`);
    const snapshot = getSnapshot(editor.store);
    saveDrawing(snapshot);
  }, [editor, saveDrawing, ticketId]);

  // Expose the saveDrawing method to the parent component
  useImperativeHandle(ref, () => ({
    saveDrawing: handleSaveDrawing,
  }));

  return null;
});
