import React, { useState } from "react";
import { X } from "lucide-react";

interface ImageCardProps {
  imageUrl?: string | null;
  index?: number;
  ticket_image_id?: string;
  onDelete?: (ticket_image_id?: string) => void;
}

export const ImageCard = ({ imageUrl, index = 0, ticket_image_id, onDelete }: ImageCardProps) => {
  const [imgError, setImgError] = useState(false);

  const handleDelete = () => {
    if (onDelete && ticket_image_id) {
      onDelete(ticket_image_id);
    }
  };

  return (
    <div className="relative rounded overflow-hidden h-24 w-full group">
      {imageUrl && !imgError ? (
        <>
          <img
            src={imageUrl}
            alt={`Image ${index + 1}`}
            className="w-full h-full object-cover"
            onError={() => {
              console.error(`Failed to load image: ${imageUrl}`);
              setImgError(true);
            }}
          />

        </>
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-muted/50">
          <p className="text-xs text-muted-foreground">Failed to load</p>
        </div>
      )}
      <button
        onClick={handleDelete}
        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Delete image"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
