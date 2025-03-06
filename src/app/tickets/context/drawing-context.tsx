"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface DrawingContextType {
  saveDrawing: (ticketId: string) => void;
  registerSaveHandler: (ticketId: string, handler: () => void) => void;
  unregisterSaveHandler: (ticketId: string) => void;
}

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export const DrawingProvider = ({ children }: { children: React.ReactNode }) => {
  const [saveHandlers, setSaveHandlers] = useState<Record<string, () => void>>({});

  const registerSaveHandler = useCallback((ticketId: string, handler: () => void) => {
    setSaveHandlers(prev => ({ ...prev, [ticketId]: handler }));
  }, []);

  const unregisterSaveHandler = useCallback((ticketId: string) => {
    setSaveHandlers(prev => {
      const newHandlers = { ...prev };
      delete newHandlers[ticketId];
      return newHandlers;
    });
  }, []);

  const saveDrawing = useCallback((ticketId: string) => {
    const handler = saveHandlers[ticketId];
    if (handler) {
      handler();
    }
  }, [saveHandlers]);

  return (
    <DrawingContext.Provider value={{ saveDrawing, registerSaveHandler, unregisterSaveHandler }}>
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawingContext = () => {
  const context = useContext(DrawingContext);
  if (context === undefined) {
    throw new Error("useDrawingContext must be used within a DrawingProvider");
  }
  return context;
};
