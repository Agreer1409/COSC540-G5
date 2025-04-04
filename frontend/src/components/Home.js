import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import '../styles/Home.css';

// Import grid background images and icons
//import profileBg from '../assets/figma/profile-bg.jpg';
import {ReactComponent as ProfileIcon} from '../assets/figma/profile-image.svg';
//import workoutsBg from '../assets/figma/workouts-bg.jpg';
import {ReactComponent as WorkoutsIcon} from '../assets/figma/workouts-image.svg';
//import libraryBg from '../assets/figma/library-bg.jpg';
import {ReactComponent as LibraryIcon} from '../assets/figma/library-image.svg';
//import progressBg from '../assets/figma/progress-bg.jpg';
import {ReactComponent as ProgressIcon} from '../assets/figma/progress-image.svg';
//import aboutBg from '../assets/figma/about-bg.jpg';
import {ReactComponent as AboutIcon} from '../assets/figma/about-image.svg';
//import adminBg from '../assets/figma/admin-bg.jpg';
import {ReactComponent as AdminIcon} from '../assets/figma/admin-image.svg';

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
    { title: 'Profile', path: '/profile', cardTitle: "Your Profile", icon: ProfileIcon },
    { title: 'Workouts', path: '/workouts', cardTitle: "Your Workouts", icon: WorkoutsIcon },
    { title: 'Library', path: '/library', cardTitle: "Library of Workouts", icon: LibraryIcon },
    { title: 'Progress', path: '/progress', cardTitle: "Progress Tracker", icon: ProgressIcon },
    { title: 'About', path: '/about', cardTitle: "About", icon: AboutIcon },
    { title: 'Admin', path: '/admin', cardTitle: "Admin", icon: AdminIcon },
  ];

  return (
    
    
    <div className="home-page">
      
      {isAuthenticated ? (
        <div>
          {/* motivation section */}
          <div className="motivation-section container">
            <div className="quote">
              "{motivation.quote}"<br />
            <span className="quote-author">— {motivation.author}</span>
            </div>
          </div>
          <div className='home-page-title'>
            <h1>What are you looking for?</h1>
          </div>
        <div className="grid-container container">
          {gridItems.map((item) => (
            <Link to={item.path} key={item.title} className="grid-card">
              <div className="card-bg">
                <h1 className="card-title-custom">{item.cardTitle}</h1>
                <item.icon className="card-icon"/>
              </div>
            </Link>
          ))}
          <footer className="text-center mt-4 text-muted">Let's get started! @ G5 Fitness @</footer>
        </div>
        </div>
      ) : (
        <div className="motivation-prompt-home container">
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