"use client";
import styled from 'styled-components';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Th = styled.th`
  background: #f5f5f5;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  color: #666;
`;

const Tr = styled.tr`
  &:hover {
    background: #f8f8f8;
  }
`;

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

export const IngredientsTable: React.FC<IngredientsTableProps> = ({ ingredients }) => {
  return (
    <Table>
      <thead>
        <tr>
          <Th>Name</Th>
          <Th>Category</Th>
          <Th>Unit</Th>
          <Th>Created At</Th>
        </tr>
      </thead>
      <tbody>
        {ingredients.map((ingredient) => (
          <Tr key={ingredient.id}>
            <Td>{ingredient.name}</Td>
            <Td>{ingredient.category}</Td>
            <Td>{ingredient.unit}</Td>
            <Td>{new Date(ingredient.created_at).toLocaleDateString()}</Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
};
