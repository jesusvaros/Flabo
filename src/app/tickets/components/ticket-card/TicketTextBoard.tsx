import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileEdit } from "lucide-react";

interface TicketTextBoardProps {
  ticketId: string;
  onClose?: () => void;
  className?: string;
  fullHeight?: boolean;
}

export const TicketTextBoard = ({
  ticketId,
  onClose,
  className = "",
  fullHeight = false,
}: TicketTextBoardProps) => {
  const [textContent, setTextContent] = useState<string>("");
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextContent(e.target.value);
  };
  
  const handleSaveNotes = () => {
    // TODO: Implement notes saving functionality
    console.log("Saving notes:", textContent);
  };

  return (
    <div className={`h-full flex flex-col items-center justify-center p-6 ${className}`}>
      <FileEdit className="h-12 w-12 mb-4 text-gray-600" />
      <h3 className="text-lg font-medium mb-2 text-black">Add Text</h3>
      <p className="text-sm text-gray-600 text-center mb-4">
        Add additional text notes to your recipe
      </p>
      <div className="w-full max-w-md">
        <textarea
          value={textContent}
          onChange={handleTextChange}
          placeholder="Add your notes here..."
          className="w-full h-32 p-3 bg-accent text-black border rounded-md resize-none"
        />
        <Button 
          variant="outline" 
          onClick={handleSaveNotes}
          className="w-full mt-2 bg-accent border text-black hover:bg-gray-50"
        >
          Save Notes
        </Button>
      </div>
    </div>
  );
};

export default TicketTextBoard;
