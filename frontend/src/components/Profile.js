import { useAuth0 } from '@auth0/auth0-react';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/Profile.css'; // Updated to Profile.css

function Profile() {
  const { loginWithRedirect, isAuthenticated, getAccessTokenSilently, user, isLoading, error } = useAuth0();
  const [profile, setProfile] = useState(null);
  const apiUrl = 'http://localhost:5000/api';

  const fetchData = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently({ cacheMode: 'on' });
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const profileRes = await axios.get(`${apiUrl}/profile`, config);
      setProfile(profileRes.data);
    } catch (error) {
      console.error('Fetch Profile Error:', error.response || error);
      if (error.error === 'login_required') loginWithRedirect();
    }
  }, [getAccessTokenSilently, apiUrl, loginWithRedirect]);

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated, fetchData]);

  const updateProfile = async () => {
    try {
      const token = await getAccessTokenSilently();
      await axios.put(`${apiUrl}/profile`, profile, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (error) {
      console.error('Update Profile Error:', error.response || error);
    }
  };

  if (error) return <div>Authentication Error: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <h1 className="profile-title">Profile</h1>

      {isAuthenticated ? (
        <div className="profile-card card">
          <div className="card-body">
            <h2 className="card-title">Your Profile</h2>
            {profile ? (
              <div>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    className="form-control"
                    value={profile.name || ''}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    className="form-control"
                    value={profile.email || user?.email || ''}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="Email"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Calories Goal</label>
                  <input
                    className="form-control"
                    type="number"
                    value={profile.calories_goal || ''}
                    onChange={(e) => setProfile({ ...profile, calories_goal: parseInt(e.target.value) || 0 })}
                    placeholder="Calories Goal"
                  />
                </div>
                <button className="btn btn-success" onClick={updateProfile}>
                  Update Profile
                </button>
              </div>
            ) : (
              <p>Loading profile...</p>
            )}
          </div>
        </div>
      ) : (
        <div className="login-prompt">
          <h2>Profile</h2>
          <p>Please log in to view and edit your profile.</p>
          <button className="btn btn-primary" onClick={() => loginWithRedirect()}>
            Log In
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;