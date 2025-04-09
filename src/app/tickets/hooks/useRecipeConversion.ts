import { useState } from 'react';
import { RecipeConversion } from '@/types/recipe-conversions';
import { createConversion, updateConversion } from '../api/recipeConversions';

interface UseRecipeConversionProps {
  ticketId: string;
  existingConversions?: RecipeConversion[];
}

interface RecipeSource {
  text?: string;
  linkUrl?: string;
  pictures?: string[];
  customPrompt?: string;
}

export function useRecipeConversion({ ticketId, existingConversions = [] }: UseRecipeConversionProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recipeConversions, setRecipeConversions] = useState<RecipeConversion[]>(existingConversions);
  const [selectedConversion, setSelectedConversion] = useState<RecipeConversion | null>(
    existingConversions.length > 0 ? existingConversions[0] : null
  );

  // Create recipe from multiple sources
  const createRecipeFromSources = async (sources: RecipeSource) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create conversion in database with all sources
      const newConversion = await createConversion({
        ticketId,
        sources,
      });

      // Update local state if conversion was successful
      if (newConversion) {
        setRecipeConversions(prev => [newConversion, ...prev]);
        setSelectedConversion(newConversion);
      }

      return newConversion;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create recipe');
      console.error('Error creating recipe:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing conversion
  const updateRecipeConversion = async (conversionId: string, updates: Partial<RecipeConversion>) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedConversion = await updateConversion({
        conversionId,
        updates
      });

      // Update local state if the update was successful
      if (updatedConversion) {
        setRecipeConversions(prev =>
          prev.map(conv => conv.id === conversionId ? updatedConversion : conv)
        );

        if (selectedConversion?.id === conversionId) {
          setSelectedConversion(updatedConversion);
        }
      }

      return updatedConversion;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update recipe conversion');
      console.error('Error updating recipe conversion:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Select a conversion
  const selectConversion = (conversion: RecipeConversion) => {
    setSelectedConversion(conversion);
  };

  return {
    isLoading,
    error,
    recipeConversions,
    selectedConversion,
    createRecipeFromSources,
    updateRecipeConversion,
    selectConversion,
  };
}
