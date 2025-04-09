import React from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { useTicketCard } from "../../context/TicketCardContext";

interface TicketPictureBoardProps {
  className?: string;
}

export const TicketPictureBoard = ({ className = "" }: TicketPictureBoardProps) => {
  // Get ticket data and state management from context
  const { state, addPicture, removePicture } = useTicketCard();
  const { pictures } = state;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // For now, we'll create object URLs as placeholders
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = URL.createObjectURL(file);
      addPicture(imageUrl);
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    removePicture(imageUrl);
  };

  return (
    <div className={`h-full flex flex-col p-6 ${className}`}>
      <div className="flex items-center mb-4">
        <ImageIcon className="h-6 w-6 mr-2 text-gray-600" />
        <h3 className="text-lg font-medium text-black">Upload Recipe Images</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Upload images of your recipe.
      </p>
      
      <label htmlFor="image-upload" className="cursor-pointer">
        <div className="w-full max-w-md p-6 border-2 border-dashed rounded-lg text-center hover:bg-gray-50 transition-colors bg-accent">
          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-600" />
          <p className="text-sm font-medium text-black">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
        </div>
        <input 
          id="image-upload" 
          type="file" 
          accept="image/*" 
          multiple 
          className="hidden" 
          onChange={handleImageUpload} 
        />
      </label>
      
      {pictures && pictures.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Uploaded Images</h4>
          <div className="grid grid-cols-2 gap-3">
            {pictures.map((imageUrl, index) => (
              <div 
                key={index} 
                className="relative border rounded-md overflow-hidden"
              >
                <img 
                  src={imageUrl} 
                  alt={`Uploaded image ${index + 1}`} 
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
                  <Button 
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveImage(imageUrl)}
                    className="text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketPictureBoard;
