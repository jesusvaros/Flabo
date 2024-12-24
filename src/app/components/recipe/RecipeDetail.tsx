"use client";
import React from "react";
import {
  RecipeContainer,
  IngredientsCard,
  IngredientsTitle,
  IngredientsList,
  IngredientItem,
  InstructionsContainer,
  RecipeTitle,
  InstructionsTitle,
  InstructionsList,
  Amount,
} from "./RecipeDetail.styled";

interface Ingredient {
  name: string;
  amount: string;
}

interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  instructions: string[];
}

interface RecipeDetailProps {
  recipe: Recipe;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe }) => {
  return (
    <RecipeContainer>
      

      <InstructionsContainer>
        <RecipeTitle>{recipe.name}</RecipeTitle>
        <InstructionsTitle>Instructions</InstructionsTitle>
        <InstructionsList>
          {recipe.instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </InstructionsList>
      </InstructionsContainer>

      <IngredientsCard>
        <IngredientsTitle>Ingredients</IngredientsTitle>
        <IngredientsList>
          {recipe.ingredients.map((ingredient, index) => (
            <IngredientItem key={index}>
              <span>{ingredient.name}</span>
              <Amount>{ingredient.amount}</Amount>
            </IngredientItem>
          ))}
        </IngredientsList>
      </IngredientsCard>
    </RecipeContainer>
  );
};
