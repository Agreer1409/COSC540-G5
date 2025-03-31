// src/components/AboutPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/About.css'; 

function AboutPage() {
  const [motivation, setMotivation] = useState({ quote: '', author: '' });

  const fetchMotivation = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/motivation/random');
      setMotivation(response.data);
    } catch (error) {
      console.error('Fetch Motivation Error:', error);
      setMotivation({ quote: "Stay motivated!", author: "G5 Fitness" });
    }
  };

  useEffect(() => {
    fetchMotivation();
  }, []);

  return (
    <div className="about-container container">
      <h1 className="about-title">About G5 Fitness</h1>
      <div className="about-content">
        <img
          src="/about.jpg"
          alt="About G5 Fitness"
          className="about-image"
        />
        <p className="about-description">
            G5 Fitness is your ultimate companion for achieving your fitness goals. We provide personalized workouts, motivational quotes, and a supportive community to keep you on track!
        </p>
        <div className="motivation-section">
            <h2 className="motivation-quote">"{motivation.quote}"</h2>
            <p className="quote-author">— {motivation.author}</p>
            <button className="btn btn-primary" onClick={fetchMotivation}>
                Get New Motivation
            </button>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;