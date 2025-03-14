"use client";

import { Loader2, MessageSquare, Wand2, History } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RecipeDisplay } from "@/app/components/recipe/RecipeDisplay";
import { TicketWithPosition } from "@/types/collections";
import { RecipeConversion } from "@/types/recipe-conversions";
import { cn } from "@/lib/utils";

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
  <div className="p-4 border-b">
    <div className="flex items-center gap-4 ">
      <Button onClick={onConvert} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Converting Drawing...
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            Convert drawing to Recipe
          </>
        )}
      </Button>

      <div className="flex items-center gap-2">
        <Label htmlFor="custom-prompt" className="text-sm">
          <MessageSquare className="mr-1 h-4 w-4 inline" />
          Custom
        </Label>
        <Switch
          id="custom-prompt"
          checked={showCustomPrompt}
          onCheckedChange={setShowCustomPrompt}
        />
      </div>
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
);

const ConversionHistory = ({
  conversions,
  selectedId,
  onSelect,
  isCollapsed,
  onToggle
}: {
  conversions: RecipeConversion[];
  selectedId?: string;
  onSelect: (conversion: RecipeConversion) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}) => (
  <div className="absolute right-0 top-0 h-full">
    <div className="p-2 pt-7 bg-accent flex items-center justify-end">
      <Button
        size="icon"
        onClick={onToggle}
        className="h-6 w-6"
      >
        <History className="h-4 w-4" />
      </Button>
    </div>
    <div className={cn(
      "flex flex-col  bg-accent h-full shadow-lg transition-all duration-200 ",
      isCollapsed ? "w-0" : "w-64"
    )}>

      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <h3 className="text-sm">Previous Conversions</h3>
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
      )}
    </div>
  </div>
);

export const AIConversionView = ({ ticket }: AIConversionViewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeConversion | null>(null);
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(true);

  const conversions = ticket.recipe_conversions;

  useEffect(() => {
    if (conversions && conversions.length > 0) {
      setSelectedRecipe(conversions[0]);
    }
  }, [conversions]);

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

  if (!ticket?.id) {
    return <NoTicketView />;
  }

  return (
    <div className="h-full relative">
      <div className="h-full flex flex-col">
        <ConversionForm
          isLoading={isLoading}
          onConvert={handleConvertToAI}
          showCustomPrompt={showCustomPrompt}
          setShowCustomPrompt={setShowCustomPrompt}
          customPrompt={customPrompt}
          setCustomPrompt={setCustomPrompt}
        />
        {selectedRecipe ? (
          <div className="flex-1 overflow-auto">
            <RecipeDisplay
              recipe={selectedRecipe}
              ticketId={ticket.id}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-sm text-muted-foreground">
              Convert your drawing to get started
            </div>
          </div>
        )}
      </div>
      <ConversionHistory
        conversions={conversions}
        selectedId={selectedRecipe?.id}
        onSelect={setSelectedRecipe}
        isCollapsed={isHistoryCollapsed}
        onToggle={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
      />
    </div>
  );
};
