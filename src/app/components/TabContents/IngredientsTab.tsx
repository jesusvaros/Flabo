import { createClient } from "../../../../utils/supabase/server";
import { IngredientsTable } from "../Tables/IngredientsTable";
import { SuspenseTab } from "./SuspenseTab";

export const IngredientsTabSuspense = () => {
  return (
    <SuspenseTab label="Ingredients" id="ingredients">
      <IngredientsTab />
    </SuspenseTab>
  );
};

const IngredientsTab = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: ingredients = [] } = await supabase
    .from("ingredients")
    .select("*")
    .eq("creator_id", user?.id);
    

  return <IngredientsTable ingredients={ingredients} />;
};
