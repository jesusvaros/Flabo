import React from "react";
import { FileEdit } from "lucide-react";
import { useTicketCard } from "./context/TicketCardContext";

interface TicketTextBoardProps {
  className?: string;
}

export const TicketTextBoard = ({ className = "" }: TicketTextBoardProps) => {
  const { state, updateTextContent } = useTicketCard();
  const { textContent } = state;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateTextContent(e.target.value);
  };

  return (
    <div className={`h-full flex flex-col p-6 ${className}`}>
      <div className="flex items-center mb-4">
        <FileEdit className="h-6 w-6 mr-2 text-gray-600" />
        <h3 className="text-lg font-medium text-black">Add Recipe Text</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Paste or type your recipe text below. Our AI will automatically convert it to our structured recipe format.
      </p>

      <textarea
        value={textContent}
        onChange={handleTextChange}
        placeholder="Paste your recipe here... (e.g., title, ingredients, instructions, notes)"
        className="w-full h-64 p-3 bg-accent text-black border rounded-md resize-none mb-4 font-medium"
      />
    </div>
  );
};

export default TicketTextBoard;
