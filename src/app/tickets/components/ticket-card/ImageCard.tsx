import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface ImageCardProps {
  title: string;
  imageUrl?: string | null;
  isProcessing: boolean;
  index: number;
  ticket_image_id?: string;
}

export const ImageCard = ({ title, imageUrl, isProcessing, index }: ImageCardProps) => {
  // Add a local timeout to ensure loading indicators eventually clear
  const [localProcessing, setLocalProcessing] = useState(isProcessing);
  
  useEffect(() => {
    setLocalProcessing(isProcessing);
  }, [isProcessing]);

  return (
    <div className="border rounded p-3">
      {/* Show image preview if available */}
      {imageUrl && (
        <div className="mb-2">
          <img 
            src={imageUrl}
            alt={title || `Image ${index + 1}`}
            className="max-h-48 max-w-full object-contain rounded"
          />
        </div>
      )}
      
      <div className="flex items-center">
        <h5 className="font-medium flex-grow">
          {title || `Image ${index + 1}`}
        </h5>
        {localProcessing && <Loader2 className="h-3 w-3 animate-spin ml-2" />}
      </div>
    </div>
  );
};
