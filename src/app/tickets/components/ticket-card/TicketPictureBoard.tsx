import React from "react";
import { ImageIcon } from "lucide-react";
import { useImageUpload } from "../../hooks/use-image-upload";
import { ImageUploadButton } from "./ImageUploadButton";
import { ImageCard } from "./ImageCard";

export const TicketPictureBoard = () => {
  const { images, isAnalyzing, handleImageUpload, handleDeleteImage } = useImageUpload();

  return (
    <div className={`h-full overflow-y-auto p-4 h-full`}>
      <div className="flex items-center mb-3">
        <ImageIcon className="h-5 w-5 mr-2" />
        <h3 className="text-lg font-medium">Recipe Images</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3">
        Upload recipe images for automatic text extraction and food identification.
      </p>
      
      <ImageUploadButton isAnalyzing={isAnalyzing} onChange={handleImageUpload} />
      
      {images.length > 0 ? (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Saved Images ({images.length})</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((image, index) => (
              <ImageCard
                key={index}
                index={index}
                imageUrl={image.image_url}
                ticket_image_id={image.id}
                onDelete={handleDeleteImage}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-muted-foreground mt-4">
          No images have been uploaded yet
        </div>
      )}
    </div>
  );
};
