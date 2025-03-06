"use client";

import { useEditor, loadSnapshot, getSnapshot, TLEditorSnapshot } from "tldraw";
import { useEffect } from "react";

interface DrawingEditorProps {
  ticketId: string;
  initialDrawing: TLEditorSnapshot | null;
  onSave?: (drawing: TLEditorSnapshot) => void;
}

export const DrawingEditor = ({
  ticketId,
  initialDrawing,
  onSave
}: DrawingEditorProps) => {
  const editor = useEditor();
  
  // Verificar que ticketId existe
  if (!ticketId) {
    console.error("DrawingEditor: ticketId es undefined");
  }

  // Cargar el dibujo inicial
  useEffect(() => {
    if (editor && initialDrawing) {
      console.log(`Cargando dibujo inicial para ticket ${ticketId}`);
      loadSnapshot(editor.store, initialDrawing);
    }
  }, [editor, initialDrawing, ticketId]);

  // Guardar el dibujo cuando el componente se desmonte
  useEffect(() => {
    if (!editor) return;

    return () => {
      // Solo guardar cuando el componente se desmonte
      if (onSave) {
        const snapshot = getSnapshot(editor.store);
        console.log(`Guardando dibujo al desmontar para ticket ${ticketId}`);
        onSave(snapshot);
      }
    };
  }, [editor, onSave, ticketId]);

  return null;
}; 