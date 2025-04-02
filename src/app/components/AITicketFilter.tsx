"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, Wand2, AlertCircle, Cpu, Cloud } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toggle } from "../../components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { searchRecipes } from "../../../utils/embeddings";
import { useCollection } from "../collections/context/CollectionContext";
import { useToast } from "@/components/ui/use-toast";

interface AITicketFilterProps {
    onFilterResults: (filteredTicketIds: string[]) => void;
}

export function AITicketFilter({ onFilterResults }: AITicketFilterProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [noResults, setNoResults] = useState(false);
    const [activeFilter, setActiveFilter] = useState(false);
    const [useLocalAI, setUseLocalAI] = useState(true);
    const [modelLoading, setModelLoading] = useState(false);
    const [localAIFailed, setLocalAIFailed] = useState(false);
    const { toast } = useToast();
    // Get tickets from the collection context
    const { tickets } = useCollection();

    // Function to prepare recipe texts for embedding
    const prepareRecipeTexts = () => {
        return tickets.map(ticket => {
            const recipeConversion = ticket.recipe_conversions?.[0];
            if (recipeConversion) {
                return `
                    Title: ${recipeConversion.title || ''}
                    Ingredients: ${recipeConversion.ingredients || ''}
                    Instructions: ${recipeConversion.instructions || ''}
                    Notes: ${recipeConversion.notes || ''}
                `;
            }
            return ticket.content || '';
        });
    };

    // Function to perform local search using client-side embeddings
    const performLocalSearch = async () => {
        try {
            setModelLoading(true);
            // Prepare the recipe texts for embedding
            const recipeTexts = prepareRecipeTexts();
            
            console.log("Starting local search with", recipeTexts.length, "texts");

            // Perform local search
            const searchResults = await searchRecipes({
                query: searchQuery,
                recipeTexts
            });

            console.log("Search results:", searchResults);
            setModelLoading(false);

            if (!searchResults || searchResults.length === 0) {
                console.log("No search results returned");
                setNoResults(true);
                onFilterResults([]);
                return false;
            }

            // Use a lower threshold for better results - 0.2 is more permissive
            const similarityThreshold = 0.2;
            
            // Map search results back to ticket IDs
            const matchingIds = searchResults
                .filter(result => result.score > similarityThreshold)
                .map(result => {
                    // If we have the originalIndex property, use it directly
                    if (result.originalIndex !== undefined && result.originalIndex >= 0 && result.originalIndex < tickets.length) {
                        return tickets[result.originalIndex].id;
                    }
                    
                    // Otherwise fall back to finding the index by text
                    const index = recipeTexts.findIndex(text => text === result.text);
                    return index >= 0 ? tickets[index].id : null;
                })
                .filter(Boolean) as string[];

            console.log("Matching IDs:", matchingIds);

            if (matchingIds.length === 0) {
                console.log("No matching IDs found after filtering");
                setNoResults(true);
                onFilterResults([]);
                return false;
            } else {
                console.log(`Found ${matchingIds.length} matching tickets`);
                setNoResults(false);
                onFilterResults(matchingIds);
                setActiveFilter(true);
                return true;
            }
        } catch (error) {
            console.error("Local search failed:", error);
            setModelLoading(false);
            setLocalAIFailed(true);
            setError("Local AI search failed. Switching to Cloud AI.");
            
            // Automatically switch to server search
            setUseLocalAI(false);
            
            // Show toast notification
            toast({
                title: "Local AI unavailable",
                description: "Switched to Cloud AI for better results.",
                duration: 3000,
            });
            
            return false;
        }
    };

    // Function to perform server-side search using OpenAI
    const performServerSearch = async () => {
        try {
            // Use the tickets from the collection context
            const response = await fetch("/api/ai/filter-tickets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: searchQuery,
                    useLocal: false
                }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            if (!data.ticketIds || data.ticketIds.length === 0) {
                setNoResults(true);
                onFilterResults([]);
                return false;
            } else {
                setNoResults(false);
                onFilterResults(data.ticketIds);
                setActiveFilter(true);
                return true;
            }
        } catch (error) {
            console.error("Server search failed:", error);
            setError(error instanceof Error ? error.message : "Failed to search tickets");
            return false;
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!searchQuery.trim()) {
            return;
        }

        setIsLoading(true);
        setError(null);
        setNoResults(false);

        try {
            let searchSuccessful = false;
            
            // If local AI previously failed, don't try it again
            if (useLocalAI && !localAIFailed) {
                // Try local search first
                searchSuccessful = await performLocalSearch();
                
                // If local search fails, try server search as fallback
                if (!searchSuccessful && error) {
                    console.log("Local search failed, falling back to server search");
                    setError(null); // Clear the error before trying server search
                    searchSuccessful = await performServerSearch();
                }
            } else {
                // Use server search directly
                searchSuccessful = await performServerSearch();
            }
            
            if (!searchSuccessful && !error) {
                setNoResults(true);
                onFilterResults([]);
            }
        } catch (error) {
            console.error("Search failed:", error);
            setError(error instanceof Error ? error.message : "Failed to search tickets");
            onFilterResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Reset local AI failed state when toggling back to local AI
    useEffect(() => {
        if (useLocalAI) {
            setLocalAIFailed(false);
        }
    }, [useLocalAI]);

    const clearSearch = () => {
        setSearchQuery("");
        setActiveFilter(false);
        setError(null);
        setNoResults(false);
        onFilterResults([]);
    };

    return (
        <div className="w-full space-y-4 mb-6">
            <form onSubmit={handleSearch} className="flex gap-2 items-center">
                <div className="relative flex-1">
                    <Input
                        type="text"
                        placeholder="Search with AI..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 bg-accent"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <AlertCircle className="h-4 w-4" />
                            <span className="sr-only">Clear search</span>
                        </button>
                    )}
                </div>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                pressed={useLocalAI}
                                onPressedChange={setUseLocalAI}
                                className={cn(
                                    "px-3",
                                    useLocalAI ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                                )}
                                disabled={isLoading || localAIFailed}
                            >
                                {useLocalAI ? (
                                    <Cpu className="h-4 w-4" />
                                ) : (
                                    <Cloud className="h-4 w-4" />
                                )}
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            {localAIFailed 
                                ? "Local AI unavailable" 
                                : useLocalAI 
                                    ? "Using local AI (faster)" 
                                    : "Using cloud AI (more accurate)"}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <Button
                    type="submit"
                    disabled={isLoading || !searchQuery.trim() || modelLoading}
                    className="bg-accent hover:bg-accent/80"
                >
                    {isLoading || modelLoading ? (
                        <>
                            <Loader2 className=" mr-2 h-4 w-4 animate-spin" />
                            {modelLoading ? "Loading model..." : "Searching..."}
                        </>
                    ) : (
                        <>
                            <Wand2 className="mr-2 h-4 w-4" />
                            AI Search
                        </>
                    )}
                </Button>
            </form>

            {error && (
                <div className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            {noResults && !error && (
                <div className="text-sm text-gray-500">
                    No matches found for "{searchQuery}"
                </div>
            )}

            {activeFilter && !noResults && !error && (
                <div className="text-sm text-blue-500">
                    Showing AI filtered results for "{searchQuery}"
                </div>
            )}
        </div>
    );
}