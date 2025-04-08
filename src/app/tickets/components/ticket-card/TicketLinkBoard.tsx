import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "lucide-react";

interface TicketLinkBoardProps {
  ticketId: string;
  onClose?: () => void;
  className?: string;
  fullHeight?: boolean;
}

export const TicketLinkBoard = ({
  ticketId,
  onClose,
  className = "",
  fullHeight = false,
}: TicketLinkBoardProps) => {
  const [linkUrl, setLinkUrl] = useState<string>("");
  
  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkUrl(e.target.value);
  };
  
  const handleAddLink = () => {
    // TODO: Implement link saving functionality
    console.log("Adding link:", linkUrl);
  };

  return (
    <div className={`h-full flex flex-col items-center justify-center p-6 ${className}`}>
      <Link className="h-12 w-12 mb-4 text-gray-600" />
      <h3 className="text-lg font-medium mb-2 text-black">Add a Link</h3>
      <p className="text-sm text-gray-600 text-center mb-4">
        Add a link to an external resource for your recipe
      </p>
      <div className="w-full max-w-md">
        <Input
          type="url"
          value={linkUrl}
          onChange={handleLinkChange}
          placeholder="https://example.com/recipe"
          className="w-full bg-accent text-black"
        />
        <Button 
          variant="outline" 
          onClick={handleAddLink}
          className="w-full mt-2 bg-accent border text-black hover:bg-gray-50"
        >
          Add Link
        </Button>
      </div>
    </div>
  );
};

export default TicketLinkBoard;
