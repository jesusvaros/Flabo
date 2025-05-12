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
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleDelete = () => {
    if (onDelete && ticket_image_id) {
      onDelete(ticket_image_id);
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImgLoaded(true);
  };

  return (
    <div className="relative rounded overflow-hidden w-full group bg-muted/10">
      {imageUrl && !imgError ? (
        <div className="w-full h-auto">
          <img
            src={imageUrl}
            alt={`Image ${index + 1}`}
            className="w-full h-auto object-contain"
            onError={() => {
              console.error(`Failed to load image: ${imageUrl}`);
              setImgError(true);
            }}
            onLoad={handleImageLoad}
          />
        </div>
      ) : (
        <div className="h-24 w-full flex items-center justify-center">
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
