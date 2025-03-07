"use client";

import { User } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { RestaurantFeatures } from "./components/RestaurantFeatures";
import { HomeCooksFeatures } from "./components/HomeCooksFeatures";
import { createClient } from "../../../utils/supabase/client";

export default function WelcomePage() {
  const [user, setUser] = useState<null | User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setIsLoading(false);
      }
    }
    checkUser();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <div className="w-full overflow-x-hidden">
      <Header />
      <HeroSection />
      <RestaurantFeatures />
      <HomeCooksFeatures />
    </div>
  );
}
