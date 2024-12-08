export const styles = `
  .landing-page {
    width: 100%;
    overflow-x: hidden;
  }

  .hero {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
    padding: 2rem;
  }

  .hero-content {
    max-width: 800px;
  }

  .hero h1 {
    font-size: 4rem;
    margin-bottom: 1rem;
    font-weight: bold;
  }

  .subtitle {
    font-size: 2rem;
    margin-bottom: 1rem;
    opacity: 0.9;
  }

  .description {
    font-size: 1.2rem;
    opacity: 0.8;
    max-width: 600px;
    margin: 0 auto;
  }

  section {
    padding: 6rem 2rem;
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .features {
    background: #f8fafc;
  }

  .home-cooks {
    background: white;
  }

  .feature {
    max-width: 1200px;
    width: 100%;
    text-align: center;
  }

  .feature h2 {
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #1a202c;
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .feature-item {
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }

  .feature-item:hover {
    transform: translateY(-5px);
  }

  .feature-item h3 {
    color: #4a5568;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  .feature-item p {
    color: #718096;
    line-height: 1.6;
  }

  .auth-section {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    color: white;
  }

  .auth-container {
    max-width: 400px;
    width: 100%;
    text-align: center;
  }

  .auth-container h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    .hero h1 {
      font-size: 3rem;
    }

    .subtitle {
      font-size: 1.5rem;
    }

    .feature h2 {
      font-size: 2rem;
    }

    section {
      padding: 4rem 1rem;
    }
  }
`;
