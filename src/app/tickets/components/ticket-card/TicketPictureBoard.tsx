import React from "react";
import { ImageIcon, Loader2 } from "lucide-react";
import { useImageUpload } from "../../hooks/use-image-upload";
import { ImageUploadButton } from "./ImageUploadButton";
import { ImageCard } from "./ImageCard";

export const TicketPictureBoard = ({ className = "" }: { className?: string }) => {
  const {
    images,
    isAnalyzing,
    backgroundProcessing,
    handleImageUpload,
    handleDeleteImage
  } = useImageUpload();

  console.log('images',images)

  return (
    <div className={`flex flex-col p-4 ${className}`}>
      <div className="flex items-center mb-3">
        <ImageIcon className="h-5 w-5 mr-2" />
        <h3 className="text-lg font-medium">Recipe Images</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-3">
        Upload recipe images for automatic text extraction and food identification.
      </p>

      <ImageUploadButton 
        isAnalyzing={isAnalyzing}
        onChange={handleImageUpload}
      />

      {backgroundProcessing > 0 && (
        <div className="mb-3 p-2 bg-muted rounded text-sm">
          <div className="flex items-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span>Analyzing {backgroundProcessing} image{backgroundProcessing !== 1 ? 's' : ''} in the background...</span>
          </div>
        </div>
      )}

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
        <div className="text-center text-muted-foreground p-4">
          No images have been uploaded yet
        </div>
      )}
    </div>
  );
};
