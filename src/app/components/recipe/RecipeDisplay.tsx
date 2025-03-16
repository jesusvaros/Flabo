"use client";

import { GenerateVisualizationButton } from "./GenerateVisualizationButton";

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

export const RecipeDisplay = ({ recipe, ticketId, onVisualizationGenerated }: RecipeDisplayProps) => (
  <div className="h-full flex flex-col flex-1 overflow-auto">
    <header className="border-b p-6 flex justify-between pr-12">
      <h2 className="text-2xl font-semibold">{recipe.title}</h2>
      <GenerateVisualizationButton
        recipe={recipe}
        ticketId={ticketId}
        onVisualizationGenerated={onVisualizationGenerated}
      />
    </header>
    <main className="overflow-y-auto flex-1">
      <div className="p-6 space-y-6">
        <section>
          <h3 className="text-lg mb-3">Ingredients</h3>
          <ul className="list-disc ml-4">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-lg mb-3">Instructions</h3>
          <ol className="list-decimal ml-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </section>

        {recipe.notes && recipe.notes.length > 0 && (
          <section>
            <h3 className="text-lg mb-3">Notes</h3>
            <ul className="list-disc ml-4">
              {recipe.notes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  </div>
);
