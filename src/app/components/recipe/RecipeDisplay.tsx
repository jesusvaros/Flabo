"use client";

import { Card } from "@/components/ui/card";
import { GenerateVisualizationButton } from "./GenerateVisualizationButton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RecipeDisplayProps {
  recipe: {
    title: string;
    ingredients: string[];
    instructions: string[];
    notes?: string[];
  };
  ticketId: string;
  onVisualizationGenerated?: (shapes: any[]) => void;
}

export const RecipeDisplay = ({
  recipe,
  ticketId,
  onVisualizationGenerated
}: RecipeDisplayProps) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-semibold">{recipe.title}</h2>
        <GenerateVisualizationButton
          recipe={recipe}
          ticketId={ticketId}
          onVisualizationGenerated={onVisualizationGenerated}
        />
      </div>

      <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-medium mb-3">Ingredients</h3>
            <ul className="list-disc list-inside space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="text-muted-foreground">
                  {ingredient}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-3">Instructions</h3>
            <ol className="list-decimal list-inside space-y-3">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="text-muted-foreground">
                  {instruction}
                </li>
              ))}
            </ol>
          </section>

          {recipe.notes && recipe.notes.length > 0 && (
            <section>
              <h3 className="text-lg font-medium mb-3">Notes</h3>
              <ul className="list-disc list-inside space-y-2">
                {recipe.notes.map((note, index) => (
                  <li key={index} className="text-muted-foreground">
                    {note}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
