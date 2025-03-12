"use client";

import { Loader2, MessageSquare, Wand2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RecipeDisplay } from "@/app/components/recipe/RecipeDisplay";
import { TicketWithPosition } from "@/types/collections";
import { RecipeConversion } from "@/types/recipe-conversions";

interface AIConversionViewProps {
  ticket: TicketWithPosition;
}

interface AIResponse {
  conversions: RecipeConversion[];
}

const LoadingView = () => (
  <div className="h-full flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

const NoTicketView = () => (
  <div className="h-full flex items-center justify-center">
    <p>No ticket selected</p>
  </div>
);

const ConversionForm = ({ 
  isLoading, 
  onConvert, 
  showCustomPrompt, 
  setShowCustomPrompt, 
  customPrompt, 
  setCustomPrompt 
}: {
  isLoading: boolean;
  onConvert: () => void;
  showCustomPrompt: boolean;
  setShowCustomPrompt: (show: boolean) => void;
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
}) => (
  <div className="h-full flex items-center justify-center">
    <div className="max-w-md w-full p-6 space-y-4">
      <Button onClick={onConvert} disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Converting Drawing...
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            Convert to Recipe
          </>
        )}
      </Button>

      <div className="flex items-center gap-2">
        <Switch
          id="custom-prompt"
          checked={showCustomPrompt}
          onCheckedChange={setShowCustomPrompt}
        />
        <Label htmlFor="custom-prompt">
          <MessageSquare className="mr-1 h-4 w-4 inline" />
          Custom Instructions
        </Label>
      </div>

      {showCustomPrompt && (
        <div>
          <Textarea
            placeholder="Add special instructions for the AI"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="min-h-[100px]"
            maxLength={500}
          />
          <div className="text-right text-xs mt-1">
            {customPrompt.length}/500
          </div>
        </div>
      )}
    </div>
  </div>
);

const ConversionHistory = ({ 
  conversions, 
  selectedId, 
  onSelect 
}: {
  conversions: RecipeConversion[];
  selectedId?: string;
  onSelect: (conversion: RecipeConversion) => void;
}) => (
  <aside className="w-64 border-l">
    <div className="border-b p-4">
      <h3 className="text-sm">Previous Conversions</h3>
    </div>
    <div className="overflow-y-auto">
      <div className="p-4 space-y-2">
        {conversions.map((conversion) => (
          <Button
            key={conversion.id}
            variant={selectedId === conversion.id ? "secondary" : "ghost"}
            className="w-full text-left"
            onClick={() => onSelect(conversion)}
          >
            <span className="truncate">{conversion.title}</span>
          </Button>
        ))}
      </div>
    </div>
  </aside>
);

export const AIConversionView = ({ ticket }: AIConversionViewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeConversion | null>(null);
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    const fetchConversions = async () => {
      try {
        const response = await fetch(`/api/ai/conversions/${ticket.id}`);
        const conversions = await response.json();

        if (conversions && conversions.length > 0) {
          setResult({ conversions });
          setSelectedRecipe(conversions[0]);
        }
      } catch (error) {
        console.error("Failed to fetch conversions:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    if (ticket?.id) {
      fetchConversions();
    } else {
      setIsLoadingHistory(false);
    }
  }, [ticket?.id]);

  const handleConvertToAI = async () => {
    try {
      setIsLoading(true);
      console.log("Converting ticket:", ticket.id);
      const response = await fetch("/api/ai/convert-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: ticket.id,
          customPrompt: customPrompt || undefined
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("API error:", error);
        throw new Error(error.error || "Failed to convert recipe");
      }

      const data = await response.json();
      setResult(data);
      setSelectedRecipe(data.conversions[0]);
      if (!showCustomPrompt) {
        setCustomPrompt("");
      }
    } catch (error) {
      console.error("Failed to convert recipe:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingHistory) {
    return <LoadingView />;
  }

  if (!ticket?.id) {
    return <NoTicketView />;
  }

  return (
    <div className="h-full flex">
      <div className="flex-1">
        {selectedRecipe ? (
          <RecipeDisplay
            recipe={selectedRecipe}
            ticketId={ticket.id}
          />
        ) : (
          <ConversionForm
            isLoading={isLoading}
            onConvert={handleConvertToAI}
            showCustomPrompt={showCustomPrompt}
            setShowCustomPrompt={setShowCustomPrompt}
            customPrompt={customPrompt}
            setCustomPrompt={setCustomPrompt}
          />
        )}
      </div>
      {result?.conversions && result.conversions.length > 0 && (
        <ConversionHistory
          conversions={result.conversions}
          selectedId={selectedRecipe?.id}
          onSelect={setSelectedRecipe}
        />
      )}
    </div>
  );
};
