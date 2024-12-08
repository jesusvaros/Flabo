'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ParallaxProvider } from 'react-scroll-parallax';
import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { RestaurantFeatures } from './components/RestaurantFeatures';
import { HomeCooksFeatures } from './components/HomeCooksFeatures';
import { styles } from './styles';

export default function WelcomePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
      
      if (user) {
        window.location.href = '/';
      }
    }
    checkUser();
  }, [supabase]);

  if (isLoading) {
    return null;
  }

  return (
    <ParallaxProvider>
      <div className="landing-page">
        <Header />
        <HeroSection />
        <RestaurantFeatures />
        <HomeCooksFeatures />
        <style jsx global>{styles}</style>
      </div>
    </ParallaxProvider>
  );
}