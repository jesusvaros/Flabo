"use client";
import { IngredientsTable } from '../Tables/IngredientsTable';

interface IngredientsTabProps {
  ingredients: any[];
}

export const IngredientsTab: React.FC<IngredientsTabProps> = ({ ingredients }) => {
  return <IngredientsTable ingredients={ingredients} />;
};
