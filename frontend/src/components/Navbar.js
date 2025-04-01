import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import '../styles/NavBar.css';
import logo from '../assets/g5fitness-logo.png'; // Import the logo

function NavBar() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const isAdmin = user && user['https://fitness-api/roles']?.includes('Admin'); // Adjust namespace
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

  return (
    <div className="navbar-wrapper">
      <Navbar  expand="lg" className="navbar-custom container">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img
              src={logo}
              alt="G5 Fitness Logo"
              className="navbar-logo me-2" // Margin-end for spacing
            />
            G5 Fitness
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto"> {/* ms-auto pushes all items to the right , me-auto to the left*/}
              <Nav.Link as={Link} to="/profile"><strong>Profile</strong></Nav.Link>
              <NavDropdown title={<strong>Workouts</strong>} id="workouts-dropdown" className="custom-dropdown">
                <NavDropdown.Item as={Link} to="/workouts" onClick={() => console.log('Navigating to /workouts')}>
                  Your Workouts
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/library" onClick={() => console.log('Navigating to /library')}>
                  Workout Library
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/progress" onClick={() => console.log('Navigating to /progress')}>
                  Progress Tracker 
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={Link} to="/about"><strong>About</strong></Nav.Link>
              {isAdmin && (
                <Nav.Link as={Link} to="/admin">Admin</Nav.Link> // Hidden unless admin
              )}

              {isAuthenticated ? (
                <>
                  <Nav.Link disabled className="text-light me-2">
                    <div 
                    className="rounded-circle d-flex justify-content-center align-items-center"
                    style={{ width: '30px', height: '30px',backgroundColor: 'white', color: '#00B7FF' }}
                    title={user?.name || user?.email || 'User'} // Shows full name on hover
                    >
                    <strong>{(user?.name || user?.email || 'User').charAt(0).toUpperCase()}</strong>
                    </div>
                    </Nav.Link>
                  <Button
                    variant="outline-danger"
                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  >
                  Log Out
                  </Button>
                </>
              ) : (
                <Button variant="outline-primary" onClick={() => loginWithRedirect()}>
                  Log In
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* motivation section */}
      <div className="motivation-section container">
        <div className="quote">
          "{motivation.quote}"<br />
          <span className="quote-author">— {motivation.author}</span>
        </div>
      </div>
    </div>
  );
}

export default NavBar;