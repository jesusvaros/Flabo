import { useState } from 'react';
import { makeChatCompletion, ChatCompletionOptions } from '../../utils/transformers/openaiClient';

/**
 * Custom hook for making ChatGPT API calls
 * @returns Object with loading state, error state, response data, and execute function
 */
export function useChatGPT<T = any>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  /**
   * Execute a ChatGPT API call
   * @param options ChatCompletion options
   * @returns Promise resolving to the API response
   */
  const execute = async (options: ChatCompletionOptions): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await makeChatCompletion<T>(options);
      setData(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    data,
    execute
  };
}