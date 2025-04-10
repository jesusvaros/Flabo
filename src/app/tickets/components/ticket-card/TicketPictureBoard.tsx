import React, { useState, useEffect } from "react";
import { ImageIcon, Upload, Loader2 } from "lucide-react";
import { useTicketCard } from "../../context/TicketCardContext";
import { useImageAnalysis } from "@/hooks/useImageAnalysis";

export const TicketPictureBoard = ({ className = "" }: { className?: string }) => {
  const { state, addImage, ticket } = useTicketCard();
  const { images } = state;
  const { analyzeImage, isAnalyzing } = useImageAnalysis();
  const [analysisStatus, setAnalysisStatus] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setAnalysisStatus(`Analyzing images...`);

    // Convert FileList to Array and process with Promise.all for parallel processing
    await Promise.all(
      Array.from(files).map(async (file) => {
        const analysisResult = await analyzeImage(file);
        
        addImage({
          image_title: analysisResult.caption || `Image ${images.length + 1}`,
          image_description: analysisResult.extractedText || '',
        });
      })
    );
    
    setAnalysisStatus(``);
    e.target.value = '';
  };

  return (
    <div className={`flex flex-col p-4 ${className}`}>
      <div className="flex items-center mb-3">
        <ImageIcon className="h-5 w-5 mr-2" />
        <h3 className="text-lg font-medium">Recipe Images</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-3">
        Upload recipe images for automatic text extraction and food identification.
      </p>

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
            </>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageUpload}
          disabled={isAnalyzing}
        />
      </label>

      {analysisStatus && (
        <div className="mb-3 p-2 bg-muted rounded text-sm">{analysisStatus}</div>
      )}

      {images.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Saved Images ({images.length})</h4>
          {images.map((image, index) => (
            <div key={image.id || index} className="border rounded p-3">
              <h5 className="font-medium">{image.image_title || `Image ${index + 1}`}</h5>
              {image.image_description && (
                <div className="mt-2 max-h-40 overflow-y-auto">
                  <p className="text-sm font-medium">Recipe Text:</p>
                  <pre className="text-xs font-mono whitespace-pre-line bg-muted p-2 rounded">
                    {image.image_description}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground p-4">
          No images have been uploaded yet
        </div>
      )}
    </div>
  );
};
