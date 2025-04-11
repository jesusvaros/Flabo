"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Ingredient {
  id: string;
  name: string;
  category: string;
  unit: string;
  created_at: string;
}

interface IngredientsTableProps {
  ingredients: Ingredient[];
}

export const IngredientsTable: React.FC<IngredientsTableProps> = ({
  ingredients,
}) => {
  return (
    <div className="rounded-lg border bg-accent shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ingredients ? (
            ingredients.map((ingredient) => (
              <TableRow key={ingredient.id} className="hover:bg-muted/50">
                <TableCell>{ingredient.name}</TableCell>
                <TableCell>{ingredient.category}</TableCell>
                <TableCell>{ingredient.unit}</TableCell>
                <TableCell>{new Date(ingredient.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">Add ingredients</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
