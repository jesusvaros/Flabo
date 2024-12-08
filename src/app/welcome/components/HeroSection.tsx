'use client';

import { Parallax } from 'react-scroll-parallax';

export const HeroSection = () => (
  <section className="hero">
    <Parallax translateY={[-20, 20]} className="hero-content">
      <h1>Flabo</h1>
      <p className="subtitle">Your Ultimate Recipe Management Platform</p>
      <p className="description">
        Streamline your kitchen operations, manage recipes, and delight your customers
      </p>
    </Parallax>
  </section>
);
