"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TicketWithPosition } from "@/types/collections";
import { Loader2 } from "lucide-react";

interface AIConversionViewProps {
  ticket: TicketWithPosition;
}

export const AIConversionView = ({ ticket }: AIConversionViewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleConvertToAI = async () => {
    try {
      setIsLoading(true);
      
      // Prepare the data to send to OpenAI
      const ticketData = {
        id: ticket.id,
        content: ticket.content,
        drawing: ticket.drawing,
        // Add any other relevant ticket data
      };
      
      // TODO: Replace with actual API call to OpenAI
      // This is a placeholder for the actual implementation
      console.log("Sending ticket data to OpenAI:", ticketData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response structure (to be defined later)
      const mockResponse = {
        success: true,
        aiGeneratedContent: "AI-enhanced version of: " + ticket.content,
        aiSuggestions: [
          "Suggestion 1 based on the drawing",
          "Suggestion 2 based on the content"
        ],
        // Other fields will be added based on the defined structure
      };
      
      setResult(mockResponse);
    } catch (error) {
      console.error("Error converting ticket to AI:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-accent/10 rounded-md p-6">
      {!result ? (
        <>
          <p className="text-center text-muted-foreground mb-6 max-w-md">
            Convert this ticket to an AI-generated version. This will analyze the drawing and content to create enhanced suggestions.
          </p>
          <Button 
            variant="default" 
            onClick={handleConvertToAI}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Convert to AI"
            )}
          </Button>
        </>
      ) : (
        <div className="w-full max-w-md">
          <h3 className="text-lg font-medium mb-4">AI Results</h3>
          <div className="bg-background p-4 rounded-md border border-border mb-4">
            <p className="font-medium text-sm text-muted-foreground mb-2">Enhanced Content:</p>
            <p>{result.aiGeneratedContent}</p>
          </div>
          
          <div className="bg-background p-4 rounded-md border border-border">
            <p className="font-medium text-sm text-muted-foreground mb-2">Suggestions:</p>
            <ul className="list-disc pl-5 space-y-1">
              {result.aiSuggestions.map((suggestion: string, index: number) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
          
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setResult(null)}
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};
