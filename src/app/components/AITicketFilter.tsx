"use client";

import { useState } from "react";
import { Search, Loader2, Wand2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface AITicketFilterProps {
    onFilterResults: (filteredTicketIds: string[]) => void;
}

export function AITicketFilter({ onFilterResults }: AITicketFilterProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [noResults, setNoResults] = useState(false);
    const [activeFilter, setActiveFilter] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setNoResults(false);

        if (!searchQuery.trim()) {
            onFilterResults([]);
            setActiveFilter(false);
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/ai/filter-tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: searchQuery
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to filter tickets");
            }

            const data = await response.json();
            console.log("AI filter response:", data);

            if (!data.ticketIds || !Array.isArray(data.ticketIds)) {
                throw new Error("Invalid response format from server");
            }

            if (data.ticketIds.length === 0) {
                setNoResults(true);
            }

            onFilterResults(data.ticketIds);
            setActiveFilter(data.ticketIds.length > 0);
        } catch (error) {
            console.error("Search error:", error);
            setError(error instanceof Error ? error.message : "An unknown error occurred");
            onFilterResults([]); // Reset results on error
            setActiveFilter(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        setError(null);
        setNoResults(false);
        setActiveFilter(false);
        onFilterResults([]);
    };

    return (
        <div className="w-full space-y-4 mb-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 mb-4 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <p>{error}</p>
                </div>
            )}

            {noResults && !error && (
                <div className="border border-yellow-200 text-yellow-800 rounded-md p-3 mb-4 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <p>No tickets found matching your search criteria.</p>
                </div>
            )}

            <form onSubmit={handleSearch} className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                        <Input
                            type="text"
                            placeholder="Describe what you're looking for..."
                            className="pl-8 bg-accent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-accent hover:bg-accent/80"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Searching...
                            </>
                        ) : (
                            <>
                                <Wand2 className="mr-2 h-4 w-4" />
                                AI Search
                            </>
                        )}
                    </Button>

                    {(searchQuery || activeFilter) && (
                        <Button
                            type="button"
                            onClick={handleClearSearch}
                            disabled={isLoading}
                            className="bg-accent hover:bg-accent/80 "
                        >
                            Clear
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
} 