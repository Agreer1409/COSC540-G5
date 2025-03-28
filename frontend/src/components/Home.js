import React from 'react';
import { Link } from 'react-router-dom';
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
      {/* Quote Section with Background */}
      <div className="quote-section">
        <div className="quote">
          "Success isn’t always about greatness.
 It’s about consistency. Consistent hard work gains success." 
– Dwayne "The Rock" Johnson
        </div>
      </div>

      {/* 2x3 Grid */}
      <div className="grid-container">
        {gridItems.map((item) => (
          <Link to={item.path} key={item.title} className="grid-card">
            <div
              className="card-bg"
              style={{ backgroundImage: `url(${item.bgImage})` }}
            >
              <img src={item.icon} alt={item.title} className="card-icon" />
              <h3 className="card-title">{item.title}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-center mt-4 text-muted">Copyright: G5 Fitness by @ G5 @</footer>
    </div>
  );
}

export default Home;