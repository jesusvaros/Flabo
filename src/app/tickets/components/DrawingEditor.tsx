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
  
  // Define the save drawing function
  const handleSaveDrawing = useCallback(() => {
    if (!editor) return;
    
    console.log(`Saving drawing for ticket ${ticketId}`);
    const snapshot = getSnapshot(editor.store);
    saveDrawing(snapshot);
  }, [editor, saveDrawing, ticketId]);
  
  // Handle the close action
  const handleClose = useCallback(() => {
    // Save the drawing first
    handleSaveDrawing();
    
    // Then call the onCloseRequested callback
    onCloseRequested();
  }, [handleSaveDrawing, onCloseRequested]);
  
  // Expose the saveDrawing method to the parent component
  useImperativeHandle(ref, () => ({
    saveDrawing: handleSaveDrawing
  }));
  
  // Set up an effect to handle the Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose]);

  // Return null as this is a logic component that doesn't render anything
  return null;
});