"use client";

import { useCallback, useEffect, useRef } from "react";
import { useEditor, getSnapshot, loadSnapshot } from "tldraw";

interface DrawingEditorProps {
  ticketId: string;
  onSave: (drawingData: any) => void;
  onLoad: () => Promise<any>;
}

/**
 * Component that wraps the tldraw editor and handles data loading/saving
 */
export const DrawingEditor = ({ ticketId, onSave, onLoad }: DrawingEditorProps) => {
  const editor = useEditor();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string | null>(null);
  
  // Load data from database on mount
  useEffect(() => {
    let isMounted = true;
    
    const loadDrawingData = async () => {
      try {
        const drawingData = await onLoad();
        
        if (drawingData && editor && isMounted) {
          // Load the drawing data into the editor
          loadSnapshot(editor.store, drawingData);
          
          // Store the initial data to compare against for future saves
          lastSavedDataRef.current = JSON.stringify(drawingData);
          
          console.log(`Drawing for ticket ${ticketId} loaded from database`);
        }
      } catch (error) {
        console.error("Error loading drawing from database:", error);
      }
    };
    
    if (editor) {
      loadDrawingData();
      
      // Set up store change listener to save changes
      const unsubscribe = editor.store.listen((event) => {
        // Only save on user-initiated changes
        if (event.source === 'user') {
          // Clear any existing timeout
          if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
          }
          
          // Set a new timeout to save after 2 seconds of inactivity
          saveTimeoutRef.current = setTimeout(() => {
            const snapshot = getSnapshot(editor.store);
            const currentData = JSON.stringify(snapshot);
            
            // Only save if data has actually changed
            if (currentData !== lastSavedDataRef.current) {
              onSave(snapshot);
              lastSavedDataRef.current = currentData;
            }
          }, 2000); // 2 second debounce
        }
      });
      
      return () => {
        isMounted = false;
        unsubscribe();
        
        // Clear any pending save on unmount
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
      };
    }
  }, [editor, ticketId, onLoad, onSave]);
  
  return null;
}; 