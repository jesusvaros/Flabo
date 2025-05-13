import React, { useEffect, useState } from "react";
import { FileEdit } from "lucide-react";
import { useTicketCard } from "../../context/TicketCardContext";


export const TicketTextBoard = (  ) => {
  const { state, updateTextContent } = useTicketCard();
  // Use local state to track the textarea value
  const [localText, setLocalText] = useState(state.textContent);
  
  // When ticket text content changes externally, update local state
  useEffect(() => {
    setLocalText(state.textContent);
  }, [state.textContent]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setLocalText(newText);
    updateTextContent(newText);
  };

  return (
    <div className={`h-full flex flex-col p-6 h-full`}>
      <div className="flex items-center mb-4">
        <FileEdit className="h-6 w-6 mr-2 text-gray-600" />
        <h3 className="text-lg font-medium text-black">Add Recipe Text</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Paste or type your recipe text below. Our AI will automatically convert it to our structured recipe format.
      </p>

      <textarea
        value={localText}
        onChange={handleTextChange}
        placeholder="Paste your recipe here... (e.g., title, ingredients, instructions, notes)"
        className="w-full h-64 p-3 bg-accent text-black border rounded-md resize-none mb-4 font-medium"
      />
      
      <div className="text-xs text-gray-500 mt-1">
        {localText ? `${localText.length} characters` : 'No text entered'}
      </div>
    </div>
  );
};

export default TicketTextBoard;
