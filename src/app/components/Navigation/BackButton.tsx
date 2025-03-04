"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const BackButton = () => {
  const router = useRouter();
  
  return (
    <Button 
      variant="ghost" 
      onClick={() => router.back()}
      className="mb-6 p-0 hover:bg-transparent"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back
    </Button>
  );
};
