"use client";

import { Tldraw, useEditor, Editor } from "tldraw";
import { useState, useEffect, useCallback } from "react";
import "tldraw/tldraw.css";
import { useDrawingStorage } from "../hooks/use-drawing-storage";
import { DrawingEditor } from "./DrawingEditor";

interface TicketDrawingBoardProps {
    ticketId: string;
    className?: string;
}

export const TicketDrawingBoard = ({ ticketId, className }: TicketDrawingBoardProps) => {
    const persistenceKey = `ticket-drawing-${ticketId}`;
    const { saveDrawing, loadDrawing } = useDrawingStorage(ticketId);

    return (
        <div className={`w-full ${className || ""}`}>
            <div className="w-full h-[400px] border rounded-md overflow-hidden">
                <Tldraw
                    persistenceKey={persistenceKey}
                    onMount={() => console.log(`Drawing board for ticket ${ticketId} mounted`)}
                >
                    <DrawingEditor
                        ticketId={ticketId}
                        onSave={saveDrawing}
                        onLoad={loadDrawing}
                    />
                </Tldraw>
            </div>
        </div>
    );
}; 