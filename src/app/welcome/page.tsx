"use client";

import {
  createClientComponentClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { RestaurantFeatures } from "./components/RestaurantFeatures";
import { HomeCooksFeatures } from "./components/HomeCooksFeatures";

export default function WelcomePage() {
  const [user, setUser] = useState<null | User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);

      if (user) {
        window.location.href = "/";
      }
    }
    checkUser();
  }, [supabase]);

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
