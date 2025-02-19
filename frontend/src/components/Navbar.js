import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useAuth0 } from '@auth0/auth0-react';
import '../styles/NavBar.css';

function NavBar() {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand >G5 Fitness</Navbar.Brand>
        <Nav className="d-flex align-items-center">
          {isAuthenticated ? (
            <div className="navbar-container">
              <img
                src={user.picture}
                alt={user.name}
                className="navbar-img"
              />
              <button
                className="btn btn-outline-danger"
                onClick={() =>
                  logout({ logoutParams: { returnTo: window.location.origin } })
                }
              >
                Log Out
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-outline-primary" 
              onClick={() => loginWithRedirect()}
            >
              Log In
            </button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavBar;
