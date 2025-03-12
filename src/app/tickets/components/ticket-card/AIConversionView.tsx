"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TicketWithPosition } from "@/types/collections";
import { Loader2, Wand2, MessageSquare } from "lucide-react";
import { RecipeConversion } from "@/types/recipe-conversions";
import { createClient } from "../../../../../utils/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RecipeDisplay } from "@/app/components/recipe/RecipeDisplay";

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

export const AIConversionView = ({ ticket }: AIConversionViewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeConversion | null>(null);
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");

  useEffect(() => {
    const fetchConversions = async () => {
      setIsLoadingHistory(true);
      const supabase = createClient();
      const { data: conversions, error } = await supabase
        .from('recipe_conversions')
        .select('*')
        .eq('ticket_id', ticket.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching conversions:", error);
        return;
      }

      if (conversions && conversions.length > 0) {
        setResult({
          recipe: conversions[0],
          conversions: conversions
        });
        setSelectedRecipe(conversions[0]);
      }
      setIsLoadingHistory(false);
    };

    fetchConversions();
  }, [ticket.id]);

  const handleConvertToAI = async () => {
    try {
      setIsLoading(true);
      
      const drawingData = ticket.drawing;
      
      const basePrompt = `
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

      const finalPrompt = showCustomPrompt && customPrompt 
        ? `${basePrompt}\n\nAdditional Instructions:\n${customPrompt}`
        : basePrompt;

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
              content: finalPrompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to convert recipe");
      }

      const data = await response.json();
      setResult(data);
      setSelectedRecipe(data.recipe);
      if (!showCustomPrompt) {
        setCustomPrompt("");
      }
    } catch (error) {
      console.error("Error converting ticket to recipe:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisualizationGenerated = (shapes: any[]) => {
    // TODO: Handle the generated visualization, e.g., show it in a modal or update the UI
    console.log("Visualization generated:", shapes);
  };

  if (isLoadingHistory) {
    return (
      <div className="flex flex-col h-full bg-accent/10 rounded-md p-6 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground mt-2">Loading recipe history...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-accent/10 rounded-md">
      <div className="flex-1 p-6 overflow-auto">
        {!selectedRecipe ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-muted-foreground text-center mb-4">
              Convert this drawing into a recipe or select a previous conversion.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-4">
                <Button 
                  variant="default" 
                  onClick={handleConvertToAI}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Converting Drawing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      Convert to Recipe
                    </>
                  )}
                </Button>
                <div className="flex items-center gap-2">
                  <Switch
                    id="custom-prompt"
                    checked={showCustomPrompt}
                    onCheckedChange={setShowCustomPrompt}
                  />
                  <Label htmlFor="custom-prompt" className="cursor-pointer">
                    <MessageSquare className="h-4 w-4" />
                  </Label>
                </div>
              </div>
              {showCustomPrompt && (
                <div className="space-y-2">
                  <Label htmlFor="custom-prompt-text">Additional Instructions</Label>
                  <Textarea
                    id="custom-prompt-text"
                    placeholder="Add any specific instructions for the AI..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="h-32"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <RecipeDisplay
            recipe={selectedRecipe}
            ticketId={ticket.id}
            onVisualizationGenerated={handleVisualizationGenerated}
          />
        )}
      </div>
      {result?.conversions && result.conversions.length > 0 && (
        <div className="w-64 border-l bg-background p-4 overflow-y-auto">
          <h3 className="font-medium text-sm mb-4">Previous Conversions</h3>
          <div className="space-y-2">
            {result.conversions.map((conversion) => (
              <Button
                key={conversion.id}
                variant={selectedRecipe?.id === conversion.id ? "secondary" : "ghost"}
                className="w-full justify-start text-left"
                onClick={() => setSelectedRecipe(conversion)}
              >
                <span className="truncate">{conversion.title}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
