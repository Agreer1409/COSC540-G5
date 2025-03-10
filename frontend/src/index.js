import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/styles.css';
import axios from 'axios';
import routes from './routes';
import NavBar from "./components/Navbar"
import { Routes, Route, BrowserRouter } from 'react-router-dom';

const Root = () => {
  const [auth0Config, setAuth0Config] = useState(null);
  const [error, setError] = useState(null); // Add error state for better debugging


  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/config');
        console.log('Fetched Config:', response.data); // Debug log
        setAuth0Config({
          domain: response.data.auth0_domain,
          clientId: response.data.client_id,
          audience: response.data.audience
        });
      } catch (error) {
        console.error('Error fetching Auth0 config:', error);
        setError('Failed to load configuration'); // Set error state
      }
    };
    fetchConfig();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!auth0Config) {
    return <div>Loading Configuration...</div>; // Show loading state until domain is fetched
  }

  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: auth0Config.audience,
        scope: "read:current_user update:current_user_metadata openid"

      }}
    >
      <NavBar/>
      <BrowserRouter>
        <Routes>
          {routes.map((route) => (
            <Route path={route.path} element={route.element} key={route.path} />
          ))}
        </Routes>
      </BrowserRouter> 
      {/* <App /> */}
    </Auth0Provider>
  );
};

const root = createRoot(document.getElementById('root'));

root.render(<Root />);
