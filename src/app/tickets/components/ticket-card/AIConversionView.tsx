import { Button } from "@/components/ui/button";

export const AIConversionView = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-accent/10 rounded-md">
      <p className="text-center text-muted-foreground mb-4">
        Convert this ticket to an AI-generated version
      </p>
      <Button variant="default">Convert to AI</Button>
    </div>
  );
};
