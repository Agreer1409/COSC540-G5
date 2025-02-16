import { Auth0Provider } from '@auth0/auth0-react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import routes from './routes';
import NavBar from "./components/Navbar"

function App() {
    return (
        <Auth0Provider
          domain="dev-i7w2dy2y7hkvaw2g.us.auth0.com"
          clientId="oyWuNP0IWo9ZM49syVQq3u5mZGobFBrW"
          authorizationParams={{
            redirect_uri: window.location.origin,
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
        
      </Auth0Provider>
    );
  }
  
  export default App;