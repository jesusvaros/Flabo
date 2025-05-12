"use client";

import { Loader2, FileText, Link, Image, Wand2, History } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RecipeDisplay } from "@/app/components/recipe/RecipeDisplay";
import { TicketWithPositionConversion } from "@/types/collections";
import { RecipeConversion } from "@/types/recipe-conversions";
import { cn } from "@/lib/utils";
import { useTicketCard } from "../../context/TicketCardContext";
import { useRecipeConversion } from "../../hooks/useRecipeConversion";

interface AIConversionViewProps {
  ticket: TicketWithPositionConversion;
}

const ConversionForm = ({
  isLoading,
  onConvert,
}: {
  isLoading: boolean;
  onConvert: () => void;
}) => {
  const { state } = useTicketCard();
  const { textContent, linkUrl, images } = state;
  
  const hasContent = textContent.trim() !== '' || linkUrl.trim() !== '' || images.length > 0;
  
  // Count sources with content
  const sourceCount = [
    textContent.trim() !== '',
    linkUrl.trim() !== '',
    images.length > 0
  ].filter(Boolean).length;
  
  return (
    <div className="p-4 border-b">
      <div className="flex items-center gap-4">
        <Button 
          onClick={onConvert} 
          disabled={isLoading || !hasContent}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Recipe...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Create Recipe
            </>
          )}
        </Button>
        
        {hasContent ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {textContent.trim() !== '' && <FileText className="h-3 w-3" />}
            {linkUrl.trim() !== '' && <Link className="h-3 w-3" />}
            {images.length > 0 && <Image className="h-3 w-3" />}
            <span>Using {sourceCount} source{sourceCount !== 1 ? 's' : ''}</span>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">
            Add content in text, link, or picture tabs
          </div>
        )}
      </div>
    </div>
  );
};

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
              <div className="flex items-center w-full overflow-hidden">
                <span className="truncate text-xs">
                  {new Date(conversion.created_at).toLocaleString()}
                </span>
              </div>
            </Button>
          ))}
          {conversions.length === 0 && (
            <div className="text-xs text-muted-foreground">
              No previous conversions
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

export const AIConversionView = ({ ticket }: AIConversionViewProps) => {
  const { state } = useTicketCard();
  const { textContent, linkUrl, images } = state;
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(true);

  const { 
    isLoading, 
    recipeConversions, 
    selectedConversion, 
    createRecipeFromSources, 
    selectConversion 
  } = useRecipeConversion({
    ticketId: ticket.id,
    existingConversions: ticket.recipe_conversions || []
  });

  const handleConvertToAI = async () => {
    try {
      // Collect data from all tabs and ticket data
      const sources = {
        text_content: textContent.trim() !== '' ? textContent : undefined,
        linkUrl: linkUrl.trim() !== '' ? linkUrl : undefined,
        images: images.length > 0 ? images : undefined,
        // Include the ticket data (content and text_content)
        ticketData: {
          id: ticket.id,
          content: ticket.content,
          text_content: ticket.text_content
        }
      };
      
      // Create the recipe from all sources
      await createRecipeFromSources(sources);
    } catch (error) {
      console.error("Error converting to recipe:", error);
    }
  };

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex-1 flex flex-col overflow-hidden">
        <ConversionForm
          isLoading={isLoading}
          onConvert={handleConvertToAI}
        />
        {selectedConversion ? (
          <RecipeDisplay
            recipe={selectedConversion}
            ticketId={ticket.id}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
            Convert your content to get started
          </div>
        )}
      </div>
      <ConversionHistory
        conversions={recipeConversions}
        selectedId={selectedConversion?.id}
        onSelect={selectConversion}
        isCollapsed={isHistoryCollapsed}
        onToggle={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
      />
    </div>
  );
};
