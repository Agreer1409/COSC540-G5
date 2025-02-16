// import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import '../styles/Home.css';

function Home () {

  const { isAuthenticated, user } = useAuth0();


  return (
    <div>
      {isAuthenticated 
      ? `Welcome to G5 Fitness ${user.email}` 
      : 'Welcome to G5 Fitness. Please log in.'}
    </div>
  )
};

export default Home;
