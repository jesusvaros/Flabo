"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TicketWithPosition } from "@/types/collections";
import { Loader2 } from "lucide-react";

interface AIConversionViewProps {
  ticket: TicketWithPosition;
}

interface AIResponse {
  recipe: {
    title: string;
    ingredients: string[];
    instructions: string[];
    notes: string[];
  };
}

export const AIConversionView = ({ ticket }: AIConversionViewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);

  const handleConvertToAI = async () => {
    try {
      setIsLoading(true);
      
      // Extract drawing data from tldraw
      const drawingData = ticket.drawing;
      
      // Create a simpler, more focused prompt for gpt-3.5-turbo
      const prompt = `
        I have a drawing of a recipe. Here's the relevant information:
        Drawing Data: ${JSON.stringify(drawingData)}

        Please analyze this drawing and extract:
        1. The recipe title from any prominent text or header
        2. List of ingredients with their quantities (look for text near ingredient items)
        3. Cooking steps (follow any arrows or numbered elements)
        4. Any special notes or tips

        Remember to:
        - Keep ingredient quantities clear (e.g., "2 cups flour")
        - Number the cooking steps
        - Include any temperature or timing information
        - Note any special techniques or warnings
      `;

      const response = await fetch("/api/ai/convert-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to convert recipe");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error converting ticket to recipe:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-accent/10 rounded-md p-6">
      {!result ? (
        <>
          <p className="text-center text-muted-foreground mb-6 max-w-md">
            Convert this drawing into a detailed recipe. The AI will analyze your drawing and create a structured recipe with ingredients and instructions.
          </p>
          <Button 
            variant="default" 
            onClick={handleConvertToAI}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Converting Drawing to Recipe...
              </>
            ) : (
              "Convert to Recipe"
            )}
          </Button>
        </>
      ) : (
        <div className="w-full max-w-md">
          <h3 className="text-xl font-medium mb-4">{result.recipe.title}</h3>
          
          <div className="bg-background p-4 rounded-md border border-border mb-4">
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Ingredients:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {result.recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          
          <div className="bg-background p-4 rounded-md border border-border mb-4">
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Instructions:</h4>
            <ol className="list-decimal pl-5 space-y-2">
              {result.recipe.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          {result.recipe.notes.length > 0 && (
            <div className="bg-background p-4 rounded-md border border-border mb-4">
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Notes:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {result.recipe.notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          )}
          
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setResult(null)}
          >
            Convert Again
          </Button>
        </div>
      )}
    </div>
  );
};
