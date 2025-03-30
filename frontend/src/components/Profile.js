import { useAuth0 } from '@auth0/auth0-react';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/Profile.css';

function Profile() {
  const { loginWithRedirect, logout, isAuthenticated, getAccessTokenSilently, user, isLoading, error } = useAuth0();
  const [profile, setProfile] = useState(null);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [theme, setTheme] = useState('light');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const apiUrl = 'http://localhost:5000/api';
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_EXTENSIONS = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];

  const fetchData = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently({ cacheMode: 'on' });
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const profileRes = await axios.get(`${apiUrl}/profile`, config);
      setProfile(profileRes.data);
      setOriginalProfile(profileRes.data);
    } catch (error) {
      console.error('Fetch Profile Error:', error.response || error);
      if (error.error === 'login_required') loginWithRedirect();
    }
  }, [getAccessTokenSilently, apiUrl, loginWithRedirect]);

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated, fetchData]);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setErrorMessage('File too large. Maximum size is 5MB.');
        return;
      }
      if (!ALLOWED_EXTENSIONS.includes(file.type)) {
        setErrorMessage('Invalid file type. Only PNG, JPG, JPEG, and GIF are allowed.');
        return;
      }
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.post(`${apiUrl}/profile/upload-image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfile({ ...profile, user_image: response.data.user_image });
      setOriginalProfile({ ...originalProfile, user_image: response.data.user_image });
      setSelectedFile(null);
    } catch (error) {
      console.error('Image Upload Error:', error.response || error);
      throw new Error(error.response?.data?.message || 'Failed to upload image');
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      setProfile(originalProfile);
      setSelectedFile(null);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const saveProfile = async () => {
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.put(`${apiUrl}/profile`, profile, { headers: { Authorization: `Bearer ${token}` } });
      await uploadImage();
      setProfile(response.data);
      setOriginalProfile(response.data);
      setSuccessMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Update Profile Error:', error.response || error);
      setErrorMessage(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (error) return <div>Authentication Error: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={`profile-page ${theme}`}>
      {isAuthenticated ? (
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-image">
              {isEditing ? (
                <div className="image-upload">
                  <img
                    src={selectedFile ? URL.createObjectURL(selectedFile) : (profile?.user_image || 'https://via.placeholder.com/100')}
                    alt="User"
                    className="rounded-circle"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="form-control mt-2"
                  />
                </div>
              ) : (
                <img
                  src={profile?.user_image || 'https://via.placeholder.com/100'}
                  alt="User"
                  className="rounded-circle"
                />
              )}
            </div>
            <h1 className="profile-name">{profile?.name || user?.name || 'User'}</h1>
            <button className="btn update-btn" onClick={toggleEdit} aria-label={isEditing ? "Cancel Edit" : "Update Profile"} disabled={isSaving}>
              {isEditing ? 'Cancel' : 'Update Profile'}
            </button>
          </div>
          <div className="profile-card">
            <h2 className="section-title">
              <i className="bi bi-person me-2"></i> Personal Information
            </h2>
            {successMessage && <p className="text-success">{successMessage}</p>}
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <div className="info-row">
              <label className="info-label">First Name</label>
              <input
                className="info-input"
                value={profile?.name?.split(' ')[0] || ''}
                onChange={(e) => {
                  const lastName = profile?.name?.split(' ')[1] || '';
                  setProfile({ ...profile, name: `${e.target.value} ${lastName}` });
                }}
                placeholder="First Name"
                disabled={!isEditing}
              />
            </div>
            <div className="info-row">
              <label className="info-label">Last Name</label>
              <input
                className="info-input"
                value={profile?.name?.split(' ')[1] || ''}
                onChange={(e) => {
                  const firstName = profile?.name?.split(' ')[0] || '';
                  setProfile({ ...profile, name: `${firstName} ${e.target.value}` });
                }}
                placeholder="Last Name"
                disabled={!isEditing}
              />
            </div>
            <div className="info-row">
              <label className="info-label">Email</label>
              <input
                className="info-input"
                value={profile?.email || user?.email || ''}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="Email"
                disabled={!isEditing}
              />
            </div>
            <div className="info-row">
              <label className="info-label">Date of Birth</label>
              <input
                className="info-input"
                type="date"
                value={profile?.dob ? profile.dob.split('T')[0] : ''}
                onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="info-row">
              <label className="info-label">Target Weight</label>
              <input
                className="info-input"
                type="number"
                value={profile?.target_weight || ''}
                onChange={(e) => setProfile({ ...profile, target_weight: parseFloat(e.target.value) || 0 })}
                placeholder="Target Weight (lbs)"
                disabled={!isEditing}
              />
            </div>
            <div className="info-row">
              <label className="info-label">Current Weight</label>
              <input
                className="info-input"
                type="number"
                value={profile?.current_weight || ''}
                onChange={(e) => setProfile({ ...profile, current_weight: parseFloat(e.target.value) || 0 })}
                placeholder="Current Weight (lbs)"
                disabled={!isEditing}
              />
            </div>
            {isEditing && (
              <div className="edit-actions">
                <button className="btn btn-success save-btn" onClick={saveProfile} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button className="btn btn-secondary cancel-btn" onClick={toggleEdit} disabled={isSaving}>
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className="profile-footer">
            <button
              className="btn btn-danger logout-btn"
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            >
              <i className="bi bi-box-arrow-left me-2"></i> Logout
            </button>
            <button className="btn btn-outline-secondary theme-toggle" onClick={toggleTheme}>
              <i className={`bi bi-${theme === 'light' ? 'moon' : 'sun'} me-2`}></i>
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
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