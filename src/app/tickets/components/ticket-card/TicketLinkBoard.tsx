import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link as LinkIcon, ExternalLink } from "lucide-react";
import { useTicketCard } from "../../context/TicketCardContext";

interface TicketLinkBoardProps {
  className?: string;
}

export const TicketLinkBoard = ({ className = "" }: TicketLinkBoardProps) => {

  const {
    state,
    updateLinkUrl,
  } = useTicketCard();
  const { linkUrl } = state;

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateLinkUrl(e.target.value);
  };

  const isValidUrl = () => {
    try {
      new URL(linkUrl);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className={`h-full flex flex-col p-6 ${className}`}>
      <div className="flex items-center mb-4">
        <LinkIcon className="h-6 w-6 mr-2 text-gray-600" />
        <h3 className="text-lg font-medium text-black">Add Recipe Link</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Add a link to an external recipe.
      </p>

      <div className="space-y-4">
        <label htmlFor="recipe-url" className="block text-sm font-medium text-gray-700 mb-1">
          Recipe URL
        </label>
        <div className="flex gap-2">
          <Input
            id="recipe-url"
            type="url"
            value={linkUrl}
            onChange={handleUrlChange}
            placeholder="https://example.com/recipe"
            className="w-full bg-accent text-black"
          />
          <Button
            variant="outline"
            onClick={() => console.log(linkUrl)}
            disabled={!isValidUrl()}
            className="bg-accent border text-black hover:bg-gray-50"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketLinkBoard;
