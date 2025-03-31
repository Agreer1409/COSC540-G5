import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import '../styles/Home.css';

// Import grid background images and icons
import profileBg from '../assets/figma/profile-bg.jpg';
import profileIcon from '../assets/figma/profile-icon.png';
import workoutsBg from '../assets/figma/workouts-bg.jpg';
import workoutsIcon from '../assets/figma/workouts-icon.png';
import libraryBg from '../assets/figma/library-bg.jpg';
import libraryIcon from '../assets/figma/library-icon.png';
import progressBg from '../assets/figma/progress-bg.jpg';
import progressIcon from '../assets/figma/progress-icon.png';
import aboutBg from '../assets/figma/about-bg.jpg';
import aboutIcon from '../assets/figma/about-icon.png';
import adminBg from '../assets/figma/admin-bg.jpg';
import adminIcon from '../assets/figma/admin-icon.png';

function Home() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const [motivation, setMotivation] = useState({ quote: '', author: '' });

  useEffect(() => {
    const fetchMotivation = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/motivation/random');
        setMotivation(response.data);
      } catch (error) {
        console.error('Fetch Motivation Error:', error);
        setMotivation({ quote: "Stay motivated!", author: "G5 Fitness" });
      }
    };
    fetchMotivation();
  }, []);

  // Grid data with imported assets
  const gridItems = [
    { title: 'Profile', path: '/profile', bgImage: profileBg, icon: profileIcon },
    { title: 'Workouts', path: '/workouts', bgImage: workoutsBg, icon: workoutsIcon },
    { title: 'Library', path: '/library', bgImage: libraryBg, icon: libraryIcon },
    { title: 'Progress', path: '/progress', bgImage: progressBg, icon: progressIcon },
    { title: 'About', path: '/about', bgImage: aboutBg, icon: aboutIcon },
    { title: 'Admin', path: '/admin', bgImage: adminBg, icon: adminIcon },
  ];

  return (
    <div className="home-page">
      {isAuthenticated ? (
        <div className="grid-container container">
          {gridItems.map((item) => (
            <Link to={item.path} key={item.title} className="grid-card">
              <div className="card-bg" style={{ backgroundImage: `url(${item.bgImage})` }}>
                <img src={item.icon} alt={item.title} className="card-icon" />
                <h3 className="card-title">{item.title}</h3>
              </div>
            </Link>
          ))}
          <footer className="text-center mt-4 text-muted">Let's get started! @ G5 Fitness @</footer>
        </div>
      ) : (
        <div className="motivation-prompt container">
          <h2 className="motivation-quote">"{motivation.quote}"</h2>
          <span className="quote-author">— {motivation.author}</span>
          <p>Log in or register to track your workouts and see your progress!</p>
          <button className="btn btn-primary" onClick={() => loginWithRedirect()}>
            Log In / Sign Up
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;