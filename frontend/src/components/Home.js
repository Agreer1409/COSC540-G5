// import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import App from '../App'; // Adjust path based on your file structure
import '../styles/Home.css';

function Home () {

  const { isAuthenticated, user } = useAuth0();


  return (
    <div> 
      <div className="welcome-message">
        {isAuthenticated 
          ? `Welcome to G5 Fitness ${user.email}` 
          : 'Welcome to G5 Fitness. Please log in.'}
      </div>
      <App />
    </div>
  )
};

export default Home;
