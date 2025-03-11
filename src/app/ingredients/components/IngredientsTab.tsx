import { SuspenseTab } from "@/app/components/TabContents/SuspenseTab";
import { IngredientsTable } from "./IngredientsTable";

interface Ingredient {
  id: string;
  name: string;
  category: string;
  unit: string;
  created_at: string;
}

interface IngredientsTabProps {
  ingredients: Ingredient[];
}

export const IngredientsTabSuspense = ({ ingredients }: IngredientsTabProps) => {
  return (
    <SuspenseTab label="Ingredients" id="ingredients">
      <IngredientsTab ingredients={ingredients} />
    </SuspenseTab>
  );
};

function IngredientsTab({ ingredients }: IngredientsTabProps) {
  return (
    <div>
      <IngredientsTable ingredients={ingredients || []} />
    </div>
  );
}
