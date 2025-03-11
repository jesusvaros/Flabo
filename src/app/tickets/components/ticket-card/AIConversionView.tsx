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
                <div className="flex items-center space-x-2">
                  <Switch
                    id="custom-prompt"
                    checked={showCustomPrompt}
                    onCheckedChange={setShowCustomPrompt}
                  />
                  <Label htmlFor="custom-prompt" className="text-sm">
                    <MessageSquare className="h-4 w-4 inline-block mr-1" />
                    Custom Instructions
                  </Label>
                </div>
              </div>
              {showCustomPrompt && (
                <div className="space-y-1">
                  <Textarea
                    placeholder="Add special instructions for the AI (e.g., 'Make it vegetarian' or 'Add cooking tips for beginners')"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="min-h-[100px] resize-none"
                    maxLength={500}
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {customPrompt.length}/500 characters
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <RecipeDisplay recipe={selectedRecipe} />
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
                      Create New Conversion
                    </>
                  )}
                </Button>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="custom-prompt"
                    checked={showCustomPrompt}
                    onCheckedChange={setShowCustomPrompt}
                  />
                  <Label htmlFor="custom-prompt" className="text-sm">
                    <MessageSquare className="h-4 w-4 inline-block mr-1" />
                    Custom Instructions
                  </Label>
                </div>
              </div>
              {showCustomPrompt && (
                <div className="space-y-1">
                  <Textarea
                    placeholder="Add special instructions for the AI (e.g., 'Make it vegetarian' or 'Add cooking tips for beginners')"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="min-h-[100px] resize-none"
                    maxLength={500}
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {customPrompt.length}/500 characters
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {result?.conversions && result.conversions.length > 0 && (
        <div className="w-64 border-l border-border bg-background/50 p-4 overflow-auto">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Previous Conversions</h4>
          <div className="space-y-2">
            {result.conversions.map((conversion) => (
              <button
                key={conversion.id}
                onClick={() => setSelectedRecipe(conversion)}
                className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                  selectedRecipe?.id === conversion.id
                    ? 'bg-secondary border border-border'
                    : 'hover:bg-accent/30'
                }`}
              >
                <div className={`font-medium truncate ${
                  selectedRecipe?.id === conversion.id ? 'text-secondary-foreground' : 'text-muted-foreground'
                }`}>{conversion.title}</div>
                <div className="text-xs text-muted-foreground/75 truncate">
                  {new Date(conversion.created_at).toLocaleDateString()}
                </div>
                {conversion.custom_prompt && (
                  <div className="text-xs text-muted-foreground/75 mt-1 truncate">
                    <span className="text-accent-foreground">Custom:</span> {conversion.custom_prompt}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
