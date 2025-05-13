"use client";

import { TLEditorSnapshot, useEditor, loadSnapshot, getSnapshot } from "tldraw";
import { forwardRef, useImperativeHandle, useEffect, useCallback } from "react";
import { useDrawingStorage } from "../hooks/use-drawing-storage";
import { useImageAnalysis } from "@/hooks/useImageAnalysis";

interface DrawingEditorProps {
  ticketId: string;
  initialDrawing: TLEditorSnapshot | null;
}

export const DrawingEditor = forwardRef<
  { saveDrawing: () => void },
  DrawingEditorProps
>(({ ticketId, initialDrawing }, ref) => {
  const editor = useEditor();
  const { saveDrawing } = useDrawingStorage(ticketId);

  useEffect(() => {
    if (editor && initialDrawing) {
      console.log(`Loading initial drawing for ticket ${ticketId}`);
      loadSnapshot(editor.store, initialDrawing);
    }
  }, [editor, initialDrawing, ticketId]);

  const handleSaveDrawing = useCallback(async () => {
    if (!editor) return;

    console.log(`Saving drawing for ticket ${ticketId}`);
    const snapshot = getSnapshot(editor.store);
    
    // try {
    //   // Convert to image and analyze in one try block
    //   const imageUrl = await convertDrawingToImage(editor,snapshot);
    //   if (!imageUrl) throw new Error("Failed to convert drawing to image");
      
    //   console.log("Image conversion successful, length:", imageUrl.length);
      
    //   const analysisResult = await analyzeImage(imageUrl);
    //   if (analysisResult.success) {
    //     description = {
    //       title: analysisResult.caption || "Untitled Drawing",
    //       ocrText: analysisResult.extractedText || ""
    //     };
    //     console.log(`Analysis successful - Title: "${description.title}"`);
    //   }
    // } catch (err) {
    //   console.error("Error during image analysis:", err);
    // }
    
    // Save drawing with whatever description we have
    try {
      await saveDrawing(snapshot);
      console.log("Drawing saved successfully");
    } catch (err) {
      console.error("Error saving drawing:", err);
    }
  }, [editor, saveDrawing, ticketId]);

  useImperativeHandle(ref, () => ({
    saveDrawing: handleSaveDrawing,
  }));

  return null;
});

// Simple function to convert drawing to image
async function convertDrawingToImage(editor: any,snapshot: any): Promise<string | null> {
  try {

    // not working TODO FIX
    if (!snapshot) return null;
    
    const shapeIds = snapshot.getCurrentPageShapeIds?.() || [];
    console.log("Getting image from shapes:", shapeIds.length || 0);
    
    const result = await editor.toImage(shapeIds, {
      type: 'png',
      quality: 1,
      scale: 2,
      background: true
    });
    
    // Convert blob to data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(result.blob);
    });
  } catch (error) {
    console.error("Error converting drawing to image:", error);
    return null;
  }
}
