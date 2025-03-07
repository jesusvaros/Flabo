"use client";

import { useCallback, useEffect, useState } from "react";
import { TLEditorSnapshot, useEditor, loadSnapshot, getSnapshot } from "tldraw";
import { useDrawingStorage } from "./use-drawing-storage";

interface UseDrawingEditorProps {
  ticketId: string;
  initialDrawing: TLEditorSnapshot | null;
  onClose: () => void;
}

export const useDrawingEditor = ({ ticketId, initialDrawing, onClose }: UseDrawingEditorProps) => {
  const editor = useEditor();
  const { saveDrawing } = useDrawingStorage(ticketId);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar el dibujo inicial solo una vez
  useEffect(() => {
    if (editor && initialDrawing && !isLoaded) {
      console.log(`Cargando dibujo inicial para ticket ${ticketId}`);
      loadSnapshot(editor.store, initialDrawing);
      setIsLoaded(true);
    }
  }, [editor, initialDrawing, isLoaded, ticketId]);

  const handleClose = useCallback(() => {
    if (!editor) return;
    
    console.log(`Guardando y cerrando editor para ticket ${ticketId}`);
    const snapshot = getSnapshot(editor.store);
    saveDrawing(snapshot);
    onClose();
  }, [editor, onClose, saveDrawing, ticketId]);

  return {
    handleClose
  };
}; 