"use client";

import { useParams } from "next/navigation";
import { CollectionsSidebar } from "../../../../components/collections/CollectionsSidebar";
import { RecipeDetail } from "../../../../components/recipe/RecipeDetail";

// This would come from your API/database
const mockRecipe = {
  id: "1",
  name: "Spaghetti Carbonara",
  ingredients: [
    { name: "Spaghetti", amount: "400g" },
    { name: "Guanciale", amount: "150g" },
    { name: "Pecorino Romano", amount: "100g" },
    { name: "Eggs", amount: "4 large" },
    { name: "Black Pepper", amount: "to taste" },
  ],
  instructions: [
    "Bring a large pot of salted water to boil and cook spaghetti according to package instructions.",
    "While the pasta cooks, cut the guanciale into small cubes.",
    "In a large bowl, whisk together eggs, grated pecorino, and black pepper.",
    "Cook guanciale in a large pan until crispy.",
    "When pasta is al dente, reserve 1 cup of pasta water and drain.",
    "Working quickly, add hot pasta to the bowl with egg mixture.",
    "Add a splash of pasta water and toss until creamy.",
    "Serve immediately with extra pecorino and black pepper.",
  ],
};

// This would come from your API/database
const mockCollections = [
  {
    id: "1",
    title: "Italian Classics",
    tickets: [
      {
        id: "1",
        title: "Spaghetti Carbonara",
        content: "Instant Pot Rice Bowl",
      },
      { id: "2", title: "Margherita Pizza", content: "Instant Pot Rice Bowl" },
    ],
  },
  {
    id: "2",
    title: "Quick Meals",
    tickets: [
      { id: "3", title: "15-min Stir Fry", content: "Instant Pot Rice Bowl" },
      {
        id: "4",
        title: "Instant Pot Rice Bowl",
        content: "Instant Pot Rice Bowl",
      },
    ],
  },
];

export default function RecipePage() {
  const params = useParams();
  const collectionId = params.id as string;
  const ticketId = params.ticketId as string;

  return (
    <div style={{ display: "flex" }}>
      <CollectionsSidebar
        collections={mockCollections}
        currentCollectionId={collectionId}
        currentTicketId={ticketId}
      />
      <RecipeDetail recipe={mockRecipe} />
    </div>
  );
}
