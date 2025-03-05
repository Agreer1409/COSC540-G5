import { useAuth0 } from '@auth0/auth0-react';
//import { Routes, Route, BrowserRouter } from 'react-router-dom';
import React, { useState, useEffect,useCallback } from 'react';
import axios from 'axios';

function App() {
  const { loginWithRedirect, logout, isAuthenticated, getAccessTokenSilently, user, isLoading, error} = useAuth0();
  const [profile, setProfile] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [library, setLibrary] = useState([]);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [newWorkout, setNewWorkout] = useState({ name: '', description: '', calories_burned: 0 });
  const [editWorkout, setEditWorkout] = useState(null);
  const apiUrl = 'http://localhost:5000/api';

  useEffect(() => {
    fetchLibrary();
  }, []);

  const fetchData = useCallback( async () => {
    try {
      const token = await getAccessTokenSilently({
        cacheMode: 'on', // Use cache if available
      });
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const profileRes = await axios.get(`${apiUrl}/profile`, config);
      setProfile(profileRes.data);
      const workoutsRes = await axios.get(`${apiUrl}/workouts`, config);
      setWorkouts(workoutsRes.data);
      setCaloriesBurned(workoutsRes.data.reduce((sum, w) => sum + w.calories_burned, 0));
    } catch (error) {
      console.error('Fetch Data Error:', error.response || error);
      if (error.error === 'login_required') {
        loginWithRedirect(); // Redirect if silent auth fails
      }
    }
  },[getAccessTokenSilently,apiUrl,loginWithRedirect]); // Dependencies of fetchData

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]); // added fetchData to dependency array

  

  const fetchLibrary = async () => {
    try {
      const res = await axios.get(`${apiUrl}/library`);
      console.log('Library Data:', res.data); // Debug
      setLibrary(res.data);
    } catch (error) {
      console.error('Fetch Library Error:', error.response || error);
    }
  };

  const updateProfile = async () => {
    const token = await getAccessTokenSilently();
    await axios.put(`${apiUrl}/profile`, profile, { headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  };

  const createWorkout = async () => {
    const token = await getAccessTokenSilently();
    await axios.post(`${apiUrl}/workouts`, newWorkout, { headers: { Authorization: `Bearer ${token}` } });
    setNewWorkout({ name: '', description: '', calories_burned: 0 });
    fetchData();
  };

  const updateWorkout = async (id) => {
    const token = await getAccessTokenSilently();
    await axios.put(`${apiUrl}/workouts/${id}`, editWorkout, { headers: { Authorization: `Bearer ${token}` } });
    setEditWorkout(null);
    fetchData();
  };

  const deleteWorkout = async (id) => {
    const token = await getAccessTokenSilently();
    await axios.delete(`${apiUrl}/workouts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  };

  console.log('isAuthenticated:', isAuthenticated); // Debug
  console.log('loginWithRedirect:', loginWithRedirect); //Debug
  console.log('user:', user); // Debug Auth0 user object
  console.log('profile:', profile); // Debug profile state


  // error and loading checks, before the main UI
  if (error) {
    console.error('Auth0 Error:', error);
    return <div>Authentication Error: {error.message}</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      <div className="container mt-4">
        <div className="welcome-message mb-4">
          {isAuthenticated 
            ? `Welcome to G5 Fitness ${profile?.email || user?.email || 'User'}` 
            : 'Welcome to G5 Fitness. Please log in.'}
        </div>
        <div className="card mb-4">
          <div className="card-body">
            <h2 className="card-title text-primary">Workout Library</h2>
            <ul className="list-group">
              {library.map((w) => (
                <li key={w.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {w.name} - {w.calories_burned} cal
                </li>
              ))}
            </ul>
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="text-center">
            <p className="lead">Log in to manage your profile and workouts!</p>
            <button className="btn btn-primary" onClick={() => loginWithRedirect()}>
              Log In
            </button>
          </div>
        ) : (
          <>
            <button
              className="btn btn-danger position-absolute top-0 end-0 m-3"
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Log Out
            </button>

            <div className="card mb-4">
              <div className="card-body">
                <h2 className="card-title text-primary">Profile</h2>
                {profile && (
                  <div>
                    <input
                      className="form-control mb-2"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      placeholder="Name"
                    />
                    <input
                      className="form-control mb-2"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      placeholder="Email"
                    />
                    <input
                      className="form-control mb-2"
                      type="number"
                      value={profile.calories_goal}
                      onChange={(e) => setProfile({ ...profile, calories_goal: parseInt(e.target.value) })}
                      placeholder="Calories Goal"
                    />
                    <button className="btn btn-success" onClick={updateProfile}>
                      Update Profile
                    </button>
                  </div>
                )}
              </div>
            </div>

            <h2 className="text-primary mb-3">Calories Burned: {caloriesBurned}/{profile?.calories_goal || 0}</h2>

            <div className="card mb-4">
              <div className="card-body">
                <h2 className="card-title text-primary">Your Workouts</h2>
                <ul className="list-group mb-3">
                  {workouts.map((w) => (
                    <li key={w.id} className="list-group-item d-flex justify-content-between align-items-center">
                      {editWorkout?.id === w.id ? (
                        <>
                          <input
                            className="form-control me-2"
                            value={editWorkout.name}
                            onChange={(e) => setEditWorkout({ ...editWorkout, name: e.target.value })}
                          />
                          <input
                            className="form-control me-2"
                            value={editWorkout.description}
                            onChange={(e) => setEditWorkout({ ...editWorkout, description: e.target.value })}
                          />
                          <input
                            className="form-control me-2"
                            type="number"
                            value={editWorkout.calories_burned}
                            onChange={(e) => setEditWorkout({ ...editWorkout, calories_burned: parseInt(e.target.value) })}
                          />
                          <button className="btn btn-success me-2" onClick={() => updateWorkout(w.id)}>Save</button>
                          <button className="btn btn-secondary" onClick={() => setEditWorkout(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          {w.name} - {w.calories_burned} cal
                          <div>
                            <button className="btn btn-warning me-2" onClick={() => setEditWorkout(w)}>Edit</button>
                            <button className="btn btn-danger" onClick={() => deleteWorkout(w.id)}>Delete</button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
                <div>
                  <input
                    className="form-control mb-2"
                    placeholder="Workout Name"
                    value={newWorkout.name}
                    onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                  />
                  <input
                    className="form-control mb-2"
                    placeholder="Description"
                    value={newWorkout.description}
                    onChange={(e) => setNewWorkout({ ...newWorkout, description: e.target.value })}
                  />
                  <input
                    className="form-control mb-2"
                    type="number"
                    placeholder="Calories"
                    value={newWorkout.calories_burned}
                    onChange={(e) => setNewWorkout({ ...newWorkout, calories_burned: parseInt(e.target.value) })}
                  />
                  <button className="btn btn-primary" onClick={createWorkout}>Add Workout</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <footer className="text-center mt-4 text-muted">Copyright: G5 Fitness by @ G5 @</footer>
    </div>

  );
}

export default App;