"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TicketWithPosition } from "@/types/collections";
import { Loader2, History } from "lucide-react";
import { RecipeConversion } from "@/types/recipe-conversions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  conversions: RecipeConversion[];
}

interface RecipeDisplayProps {
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
  const [showHistory, setShowHistory] = useState(false);

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
          ticketId: ticket.id,
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

  const RecipeDisplay = ({ recipe }: RecipeDisplayProps) => (
    <div className="space-y-4">
      <h3 className="text-xl font-medium">{recipe.title}</h3>
      
      <div className="bg-background p-4 rounded-md border border-border">
        <h4 className="font-medium text-sm text-muted-foreground mb-2">Ingredients:</h4>
        <ul className="list-disc pl-5 space-y-1">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>
      
      <div className="bg-background p-4 rounded-md border border-border">
        <h4 className="font-medium text-sm text-muted-foreground mb-2">Instructions:</h4>
        <ol className="list-decimal pl-5 space-y-2">
          {recipe.instructions.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>

      {recipe.notes.length > 0 && (
        <div className="bg-background p-4 rounded-md border border-border">
          <h4 className="font-medium text-sm text-muted-foreground mb-2">Notes:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {recipe.notes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-accent/10 rounded-md p-6">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground max-w-md">
          Convert this drawing into a detailed recipe. The AI will analyze your drawing and create a structured recipe with ingredients and instructions.
        </p>
        {result?.conversions && result.conversions.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            {showHistory ? "Hide History" : "Show History"}
          </Button>
        )}
      </div>

      {!result ? (
        <Button 
          variant="default" 
          onClick={handleConvertToAI}
          disabled={isLoading}
          className="flex items-center gap-2 self-start"
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
      ) : (
        <div className="space-y-6 overflow-auto">
          <RecipeDisplay recipe={result.recipe} />
          
          {showHistory && result.conversions && result.conversions.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-medium mb-4">Conversion History</h4>
              <Accordion type="single" collapsible className="w-full">
                {result.conversions.map((conversion, index) => (
                  <AccordionItem key={conversion.id} value={conversion.id}>
                    <AccordionTrigger>
                      {conversion.title} - {new Date(conversion.created_at).toLocaleString()}
                    </AccordionTrigger>
                    <AccordionContent>
                      <RecipeDisplay recipe={conversion} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => setResult(null)}
            className="mt-4"
          >
            Convert Again
          </Button>
        </div>
      )}
    </div>
  );
};
