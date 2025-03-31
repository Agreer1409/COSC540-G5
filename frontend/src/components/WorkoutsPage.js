import { useAuth0 } from '@auth0/auth0-react';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import DatePicker from 'react-datepicker';
import '../styles/Workouts.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function WorkoutsPage() {
  const { loginWithRedirect, isAuthenticated, getAccessTokenSilently, isLoading, error } = useAuth0();
  const [workouts, setWorkouts] = useState([]);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    description: '',
    calories_burned: 0,
    date: null,
  });
  const [motivation, setMotivation] = useState({ quote: '', author: '' });
  const apiUrl = 'http://localhost:5000/api';

  const fetchWorkouts = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently({ cacheMode: 'on' });
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const workoutsRes = await axios.get(`${apiUrl}/workouts`, config);
      const sortedWorkouts = workoutsRes.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      console.log('Raw API Response:', workoutsRes.data);
      setWorkouts(sortedWorkouts);
    } catch (error) {
      console.error('Fetch Workouts Error:', error.response || error);
      if (error.error === 'login_required') loginWithRedirect();
    }
  }, [getAccessTokenSilently, apiUrl, loginWithRedirect]);

  const fetchMotivation = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/motivation/random');
      setMotivation(response.data);
    } catch (error) {
      console.error('Fetch Motivation Error:', error);
      setMotivation({ quote: "Stay motivated!", author: "G5 Fitness" });
    }
  };

  const createWorkout = async () => {
    try {
      const token = await getAccessTokenSilently();
      const workoutData = {
        ...newWorkout,
        date: newWorkout.date ? newWorkout.date.toISOString() : new Date().toISOString(),
        calories_burned: parseInt(newWorkout.calories_burned) || 0,
      };
      console.log('Sending workout data:', workoutData);
      await axios.post(`${apiUrl}/workouts`, workoutData, { headers: { Authorization: `Bearer ${token}` } });
      setNewWorkout({
        name: '',
        description: '',
        calories_burned: 0,
        date: null,
      });
      fetchWorkouts();
    } catch (error) {
      console.error('Create Workout Error:', error.response || error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkouts();
    } else {
      fetchMotivation();
    }
  }, [isAuthenticated, fetchWorkouts]);

  if (error) return <div>Authentication Error: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;

  const formatDate = (dateString) => {
    if (!dateString || typeof dateString !== 'string') return 'Date N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
  };

  const chartData = {
    labels: workouts.map((w) => w.name),
    datasets: [
      {
        label: 'Calories Burned',
        data: workouts.map((w) => w.calories_burned),
        backgroundColor: ['#28a745', '#007bff', '#dc3545', '#ffc107', '#6f42c1', '#fd7e14'].slice(
          0,
          workouts.length
        ),
        borderColor: ['#218838', '#0056b3', '#c82333', '#e0a800', '#5a32a3', '#d65f0d'].slice(
          0,
          workouts.length
        ),
        borderWidth: 1,
        hoverBackgroundColor: '#ffd700',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Calories Burned', color: '#fff' },
        ticks: { color: '#fff' },
        grid: { color: '#495057' },
      },
      x: {
        title: { display: true, text: 'Workouts', color: '#fff' },
        ticks: { color: '#fff' },
        grid: { display: false },
      },
    },
    plugins: {
      legend: { labels: { color: '#fff' } },
      tooltip: {
        enabled: true,
        backgroundColor: '#343a40',
        titleColor: '#ffd700',
        bodyColor: '#fff',
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  return (
    <div className="workouts-container container">
      {isAuthenticated ? (
        <>
          <h1 className="workouts-title">Workouts</h1>
          <div className="workouts-content">
            <div className="workouts-form card mb-4">
              <div className="card-body">
                <h2 className="card-title">Log a New Workout</h2>
                <div className="mb-3">
                  <label className="form-label">Workout Name</label>
                  <input
                    className="form-control"
                    value={newWorkout.name}
                    onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                    placeholder="e.g., Running"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <input
                    className="form-control"
                    value={newWorkout.description}
                    onChange={(e) => setNewWorkout({ ...newWorkout, description: e.target.value })}
                    placeholder="e.g., 5k run"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Calories Burned</label>
                  <input
                    className="form-control"
                    type="number"
                    value={newWorkout.calories_burned}
                    onChange={(e) => setNewWorkout({ ...newWorkout, calories_burned: e.target.value })}
                    placeholder="e.g., 300"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <DatePicker
                    selected={newWorkout.date}
                    onChange={(date) => {
                      console.log('DatePicker selected:', date);
                      setNewWorkout({ ...newWorkout, date });
                    }}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select a date"
                  />
                </div>
                <button className="btn btn-primary" onClick={createWorkout}>
                  Add Workout
                </button>
              </div>
            </div>

            <div className="workouts-list card">
              <div className="card-body">
                <h2 className="card-title">Workout History</h2>
                {workouts.length > 0 ? (
                  <ul className="list-group">
                    {workouts.map((workout) => (
                      <li key={workout.id} className="list-group-item">
                        {workout.name} - {workout.calories_burned} cal
                        <span className="text-muted ms-2">({formatDate(workout.date)})</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No workout history yet.</p>
                )}
              </div>
            </div>

            <div className="workouts-chart card mt-4">
              <div className="card-body">
                <h2 className="card-title">Calories Burned Histogram</h2>
                <div style={{ height: '300px' }}>
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="motivation-prompt">
          <h2 className="motivation-quote">"{motivation.quote}"</h2>
          <span className="quote-author">— {motivation.author}</span>
          <p>Log in or register to track your workouts and see your progress!</p>
          <button className="btn btn-primary" onClick={() => loginWithRedirect()}>
            Log In / Sign Up
          </button>
        </div>
      )}
    </div>
  );
}

export default WorkoutsPage;