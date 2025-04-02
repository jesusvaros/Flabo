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
    // Get tickets from the collection context
    const { tickets } = useCollection();

    // Function to perform local search using client-side embeddings
    const performLocalSearch = async () => {
        try {
            setModelLoading(true);
            // Prepare the recipe texts for embedding
            const recipeTexts = tickets.map(ticket => {
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

            // Perform local search
            const searchResults = await searchRecipes({
                query: searchQuery,
                recipeTexts
            });

            console.log("Search results:", searchResults);

            setModelLoading(false);

            // Map search results back to ticket IDs
            const matchingIds = searchResults
                .filter(result => result.score > 0.6) // Only include results with good similarity
                .map(result => {
                    const index = recipeTexts.indexOf(result.text);
                    return index >= 0 ? tickets[index].id : null;
                })
                .filter(Boolean) as string[];

            if (matchingIds.length === 0) {
                setNoResults(true);
            } else {
                setNoResults(false);
                onFilterResults(matchingIds);
                setActiveFilter(true);
            }
        } catch (error) {
            console.error("Local search failed:", error);
            setModelLoading(false);
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
            } else {
                setNoResults(false);
                onFilterResults(data.ticketIds);
                setActiveFilter(true);
            }
        } catch (error) {
            console.error("Server search failed:", error);
            setError(error instanceof Error ? error.message : "Failed to search tickets");
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
            if (useLocalAI) {
                await performLocalSearch();
            } else {
                await performServerSearch();
            }
        } catch (error) {
            console.error("Search failed:", error);
            setError(error instanceof Error ? error.message : "Failed to search tickets");
        } finally {
            setIsLoading(false);
        }
    };

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
                                disabled={isLoading}
                            >
                                {useLocalAI ? (
                                    <Cpu className="h-4 w-4" />
                                ) : (
                                    <Cloud className="h-4 w-4" />
                                )}
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            {useLocalAI ? "Using local AI (faster)" : "Using cloud AI (more accurate)"}
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