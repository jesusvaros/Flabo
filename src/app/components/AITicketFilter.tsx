"use client";

import { useState } from "react";
import { Loader2, Wand2, X, Cpu, Cloud } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toggle } from "../../components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { searchRecipes } from "../../../utils/embeddings";
import { useCollection } from "../collections/context/CollectionContext";
import { useToast } from "@/components/ui/use-toast";
import { TicketWithPositionConversion } from "@/types/collections";

interface AITicketFilterProps {
    onFilterResults: (filteredTicketIds: string[]) => void;
    tickets?: TicketWithPositionConversion[];
}

export function AITicketFilter({ onFilterResults, tickets: propTickets }: AITicketFilterProps) {
    // Input and search state
    const [searchQuery, setSearchQuery] = useState("");
    const [activeQuery, setActiveQuery] = useState("");

    // Search status states
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "no-results">("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // AI mode state
    const [useLocalAI, setUseLocalAI] = useState(true);

    const { toast } = useToast();
    const { tickets: contextTickets } = useCollection();
    
    // Use provided tickets or fall back to context tickets
    const tickets = propTickets || contextTickets;

    // Function to prepare recipe texts for embedding
    const prepareRecipeTexts = () => {
        return tickets.map(ticket => {
            const recipeConversion = ticket.recipe_conversions?.[0];
            if (recipeConversion) {
                return `Main Title: ${ticket.content || ''}
                    Recipe Title: ${recipeConversion.title || ''}
                    Ingredients: ${recipeConversion.ingredients || ''}
                    Instructions: ${recipeConversion.instructions || ''}
                    Notes: ${recipeConversion.notes || ''}`;
            }
            return ticket.content || '';
        });
    };

    const performLocalSearch = async () => {
        try {
            const recipeTexts = prepareRecipeTexts();

            const searchResults = await searchRecipes({
                query: searchQuery,
                recipeTexts
            });

            if (!searchResults || searchResults.length === 0) {
                return { success: false, matchingIds: [] };
            }

            const similarityThreshold = 0.3;

            const matchingIds = searchResults
                .filter(result => {
                    const passes = result.score > similarityThreshold;
                    return passes;
                })
                .map(result => {
                    // If we have the originalIndex property, use it directly
                    if (result.originalIndex !== undefined && result.originalIndex >= 0 && result.originalIndex < tickets.length) {
                        const id = tickets[result.originalIndex].id;
                        return id;
                    }

                    // Otherwise fall back to finding the index by text
                    const index = recipeTexts.findIndex(text => text === result.text);
                    if (index >= 0 && index < tickets.length) {
                        const id = tickets[index].id;
                        return id;
                    } else {
                        return null;
                    }
                })
                .filter(Boolean) as string[];
            
            return { success: matchingIds.length > 0, matchingIds };
        } catch (error) {
            console.error("Local search failed:", error);
            throw error;
        }
    };

    const performServerSearch = async () => {
        try {
            const response = await fetch("/api/ai/filter-tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: searchQuery, useLocal: false }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            return {
                success: data.ticketIds && data.ticketIds.length > 0,
                matchingIds: data.ticketIds || []
            };
        } catch (error) {
            throw error;
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!searchQuery.trim()) {
            return;
        }

        setStatus("loading");
        setErrorMessage(null);

        try {
            let searchResult;

            // If local AI previously failed, don't try it again
            if (useLocalAI) {
                searchResult = await performLocalSearch();

            } else {
                searchResult = await performServerSearch();
            }

            if (searchResult.success) {
                setStatus("success");
                onFilterResults(searchResult.matchingIds);
                setActiveQuery(searchQuery);
            } else {
                setStatus("no-results");
                onFilterResults([]);
            }
        } catch (error) {
            setStatus("error");
            setErrorMessage(error instanceof Error ? error.message : "Failed to search tickets");
            onFilterResults([]);
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        setStatus("idle");
        setErrorMessage(null);
        setActiveQuery("");
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
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && searchQuery.trim()) {
                                e.preventDefault();
                                handleSearch(e);
                            }
                        }}
                        className="pl-8 bg-accent"
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            onClick={clearSearch}
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Clear search</span>
                        </Button>
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
                                disabled={status === "loading"}
                            >
                                {useLocalAI ? (
                                    <Cpu className="h-4 w-4" />
                                ) : (
                                    <Cloud className="h-4 w-4" />
                                )}
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            {useLocalAI
                                ? "Using local AI (faster)"
                                : "Using cloud AI (more accurate)"}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <Button
                    type="submit"
                    disabled={status === "loading" || !searchQuery.trim()}
                    className="bg-accent hover:bg-accent/80"
                >
                    {status === "loading" ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Searching...
                        </>
                    ) : (
                        <>
                            <Wand2 className="mr-2 h-4 w-4" />
                            Search
                        </>
                    )}
                </Button>
            </form>

            {status === "error" && errorMessage && (
                <div className="text-sm text-red-500 flex items-center gap-1">
                    <X className="h-4 w-4" />
                    {errorMessage}
                </div>
            )}

            {status === "no-results" && (
                <div className="text-sm text-gray-500">
                    No matches found for "{searchQuery}"
                </div>
            )}

            {status === "success" && (
                <div className="text-sm text-blue-500">
                    Showing AI filtered results for "{activeQuery}"
                </div>
            )}
        </div>
    );
}