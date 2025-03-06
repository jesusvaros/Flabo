"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { DrawingEditor } from "./DrawingEditor";
import { TLEditorSnapshot } from "tldraw";

interface TicketDrawingBoardProps {
    ticketId: string;
    className?: string;
    initialDrawing: TLEditorSnapshot | null;
    onSave?: (drawing: TLEditorSnapshot) => void;
}

export const TicketDrawingBoard = ({
    ticketId,
    className,
    initialDrawing,
    onSave,
}: TicketDrawingBoardProps) => {
    console.log(`TicketDrawingBoard montado para ticket ${ticketId}`);

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
                    onSave={onSave}
                />
            </Tldraw>
        </div>
    );
};