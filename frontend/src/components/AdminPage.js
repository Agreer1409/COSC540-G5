// AdminPage.js
import { useAuth0 } from '@auth0/auth0-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Admin.css';

function AdminPage() {
  const { user, isAuthenticated, getAccessTokenSilently, loginWithRedirect } = useAuth0();
  const [motivation, setMotivation] = useState({ quote: '', author: '' });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]); // State for roles
  const [isAdmin, setIsAdmin] = useState(false); // State for admin status

  const fetchMotivation = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/motivation/random');
      setMotivation(response.data);
    } catch (error) {
      console.error('Fetch Motivation Error:', error);
      setMotivation({ quote: "Stay motivated!", author: "G5 Fitness" });
    }
  };

  const fetchUsers = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Fetch Users Error:', err.response || err);
      setError(err.response?.data?.message || 'Failed to fetch users.');
    }
  };

  useEffect(() => {
    const initialize = async () => {
      if (!isAuthenticated) {
        fetchMotivation();
        return;
      }

      try {
        // Get and decode access token
        const token = await getAccessTokenSilently({ audience: 'https://fitness-api' });
        console.log('Access Token:', token);
        const payload = JSON.parse(atob(token.split('.')[1])); // Base64 decode JWT payload
        console.log('Raw Payload:', payload);
        const userRoles = payload['https://fitness-api/roles'] || [];
        setRoles(userRoles);
        setIsAdmin(userRoles.includes('admin')); // Check lowercase 'admin'

        console.log('Access Token:', token);
        console.log('Roles:', userRoles);
        console.log('Is Admin:', userRoles.includes('admin'));

        // Fetch users if admin
        if (userRoles.includes('admin')) {
          await fetchUsers(token);
        }
      } catch (err) {
        console.error('Token Error:', err);
        setError('Failed to authenticate with token.');
      }
    };

    initialize();
  }, [isAuthenticated, getAccessTokenSilently]);

  // Debug logs
  console.log('User:', user);
  console.log('Roles:', roles);
  console.log('Is Admin:', isAdmin);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="admin-container container">
        <div className="motivation-prompt">
          <h2 className="motivation-quote">"{motivation.quote}"</h2>
          <span className="quote-author">— {motivation.author}</span>
          <p>{isAuthenticated ? 'Access Denied: Admin Only' : 'Log in or register to access the admin dashboard!'}</p>
          {!isAuthenticated && (
            <button className="btn btn-primary" onClick={() => loginWithRedirect()}>
              Log In / Sign Up
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container container">
      <h1 className="admin-title">Admin Dashboard</h1>
      {error && <p className="text-danger">{error}</p>}
      <div className="admin-section">
        <h2>Manage Users</h2>
        {users.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Calories Goal</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.calories_goal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found.</p>
        )}
      </div>
      <div className="admin-section">
        <h2>Workout Library</h2>
        <p>Manage the library of available workouts.</p>
        {/* Add workout library UI */}
      </div>
      <div className="admin-section">
        <h2>Inspirational Phrases</h2>
        <p>Add, edit, or remove motivational quotes.</p>
        {/* Add phrases UI */}
      </div>
      <div className="admin-section">
        <h2>Theme Settings</h2>
        <p>Customize the app's theme and colors.</p>
        {/* Add theme color UI */}
      </div>
    </div>
  );
}

export default AdminPage;