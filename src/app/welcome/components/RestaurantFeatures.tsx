'use client';

import { Parallax } from 'react-scroll-parallax';

export const RestaurantFeatures = () => (
  <section className="features">
    <Parallax translateY={[-15, 15]} className="feature">
      <h2>For Restaurants</h2>
      <div className="feature-grid">
        <div className="feature-item">
          <h3>Ticket Standardization</h3>
          <p>Maintain consistency across all your locations</p>
        </div>
        <div className="feature-item">
          <h3>Cost Control</h3>
          <p>Track ingredient costs and optimize profitability</p>
        </div>
        <div className="feature-item">
          <h3>Team Training</h3>
          <p>Easy-to-follow instructions for your staff</p>
        </div>
      </div>
    </Parallax>
  </section>
);
