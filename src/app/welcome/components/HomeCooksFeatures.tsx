'use client';

import { Parallax } from 'react-scroll-parallax';

export const HomeCooksFeatures = () => (
  <section className="home-cooks">
    <Parallax translateY={[-15, 15]} className="feature">
      <h2>For Home Cooks</h2>
      <div className="feature-grid">
        <div className="feature-item">
          <h3>Ticket Collection</h3>
          <p>Store and organize your favorite tickets</p>
        </div>
        <div className="feature-item">
          <h3>Meal Planning</h3>
          <p>Plan your weekly meals with ease</p>
        </div>
        <div className="feature-item">
          <h3>Shopping Lists</h3>
          <p>Automatically generate shopping lists</p>
        </div>
      </div>
    </Parallax>
  </section>
);
