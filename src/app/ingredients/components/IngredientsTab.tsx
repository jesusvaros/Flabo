import { SuspenseTab } from "@/app/components/TabContents/SuspenseTab";
import { createClient } from "../../../../utils/supabase/server";
import { IngredientsTable } from "./IngredientsTable";

export const IngredientsTabSuspense = () => {
  return (
    <SuspenseTab label="Ingredients" id="ingredients">
      <IngredientsTab />
    </SuspenseTab>
  );
};

export const IngredientsTab = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: ingredients } = await supabase
    .from("ingredients")
    .select("*")
    .eq("creator_id", user?.id);

  return (
    <div>
      <IngredientsTable ingredients={ingredients || []} />
    </div>
  );
};
