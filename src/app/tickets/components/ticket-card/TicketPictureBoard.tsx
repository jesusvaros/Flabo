import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image } from "lucide-react";

interface TicketPictureBoardProps {
  ticketId: string;
  onClose?: () => void;
  className?: string;
  fullHeight?: boolean;
}

export const TicketPictureBoard = ({
  ticketId,
  onClose,
  className = "",
  fullHeight = false,
}: TicketPictureBoardProps) => {
  return (
    <div className={`h-full flex flex-col items-center justify-center p-6 ${className}`}>
      <Image className="h-12 w-12 mb-4 text-gray-600" />
      <h3 className="text-lg font-medium mb-2 text-black">Add an Image</h3>
      <p className="text-sm text-gray-600 text-center mb-4">
        Upload an image to accompany your recipe
      </p>
      <div className="w-full max-w-md p-6 border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-gray-50 transition-colors bg-accent">
        <p className="text-sm font-medium text-black">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
      </div>
    </div>
  );
};

export default TicketPictureBoard;
