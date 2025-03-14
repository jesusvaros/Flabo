"use client";

import { DISABLE_GENERATED_DRAWING } from "@/app/tickets/components/ticket-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Wand2 } from "lucide-react";
import { useState } from "react";

interface GenerateVisualizationButtonProps {
  recipe: {
    title: string;
    ingredients: string[];
    instructions: string[];
    notes?: string[];
  };
  ticketId: string;
  onVisualizationGenerated?: (shapes: any[]) => void;
}

export const GenerateVisualizationButton = ({
  recipe,
  ticketId,
  onVisualizationGenerated
}: GenerateVisualizationButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateVisualization = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/recipe-to-tldraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipe,
          ticketId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate visualization');
      }

      const data = await response.json();
      onVisualizationGenerated?.(data.shapes);
      
      toast({
        title: "Success",
        description: "Recipe visualization generated successfully!",
      });
    } catch (error) {
      console.error("Visualization Error:", error);
      toast({
        title: "Error",
        description: "Failed to generate visualization. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleGenerateVisualization}
      disabled={isGenerating || DISABLE_GENERATED_DRAWING}
      className="flex items-center gap-2"
    >
      <Wand2 className="h-4 w-4" />
      <span>{isGenerating ? "Generating..." : "Generate Visualization"}</span>
    </Button>
  );
};
