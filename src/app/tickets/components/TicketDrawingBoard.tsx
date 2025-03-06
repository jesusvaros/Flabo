"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { DrawingEditor } from "./DrawingEditor";
import { TLEditorSnapshot } from "tldraw";
import { forwardRef, useImperativeHandle, useRef } from "react";

interface TicketDrawingBoardProps {
    ticketId: string;
    className?: string;
    initialDrawing: TLEditorSnapshot | null;
    onClose: () => void;
}

export const TicketDrawingBoard = forwardRef<
    { saveDrawing: () => void },
    TicketDrawingBoardProps
>(({ ticketId, className, initialDrawing, onClose }, ref) => {
    console.log(`TicketDrawingBoard montado para ticket ${ticketId}`);
    
    // Create a ref to store the drawing editor instance
    const drawingEditorRef = useRef<{ saveDrawing: () => void } | null>(null);
    
    // Expose the saveDrawing method to the parent component
    useImperativeHandle(ref, () => ({
        saveDrawing: () => {
            if (drawingEditorRef.current) {
                drawingEditorRef.current.saveDrawing();
            }
        }
    }));

    return (
        <div className={className} style={{ height: "400px" }}>
            <Tldraw
                components={{
                    PageMenu: null,
                    NavigationPanel: null,
                    MainMenu: null,
                }}
                overrides={{
                    translations: {
                        es: {
                            'assets.files.amount-too-many': 'Demasiados archivos'
                        }
                    }
                }}
            >
                <DrawingEditor
                    ticketId={ticketId}
                    initialDrawing={initialDrawing}
                    onCloseRequested={onClose}
                    ref={drawingEditorRef}
                />
            </Tldraw>
        </div>
    );
});