import React from "react";
import { Upload, Loader2 } from "lucide-react";

interface ImageUploadButtonProps {
  isAnalyzing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUploadButton = ({ isAnalyzing, onChange }: ImageUploadButtonProps) => {
  return (
    <label className="cursor-pointer mb-3">
      <div className="border-2 border-dashed rounded p-4 text-center hover:bg-muted/50 transition-colors">
        {isAnalyzing ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Processing...</span>
          </div>
        ) : (
          <>
            <Upload className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm">Click to upload recipe images</p>
            <p className="text-xs text-muted-foreground mt-1">You can continue using the app while images analyze</p>
          </>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onChange}
        disabled={isAnalyzing}
      />
    </label>
  );
};
