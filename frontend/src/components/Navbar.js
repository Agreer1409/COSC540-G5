import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';
import {ReactComponent as Logo} from '../assets/logo.svg'; // Import the logo

function NavBar() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const isAdmin = user && user['https://fitness-api/roles']?.includes('Admin'); // Adjust namespace

  return (
    <div className="navbar-wrapper">
      <Navbar  expand="lg" className="navbar-custom container">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <Logo className="navbar-logo" />
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
      
    </div>
  );
}

export default NavBar;