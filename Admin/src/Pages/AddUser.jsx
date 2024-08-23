import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postUser } from '../Redux/actions/UserListAction';
import { useNavigate } from 'react-router-dom';
import '../Style/AddUser.css'; // Import the CSS file

function AddUser() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState({
    latitude: 0.0,
    longitude: 0.0,
    user: {
      name: '',
      email: '',
      password: '',
      role: "employee"
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (data.latitude === 0.0 || data.longitude === 0.0) {
      getLocation();
    }
    dispatch(postUser(data));
    navigate("/user-list");
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setData({
          ...data,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      alert("Please allow the location for the task Location");
    }
  };

  return (
    <div className="add-user-container">
      <h1>Add User</h1>
      <form onSubmit={handleSubmit} className="add-user-form">
        <button type="button" onClick={getLocation} className="location-button">Current Location</button>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setData({ ...data, user: { ...data.user, name: e.target.value } })}
          required
          className="form-input"
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setData({ ...data, user: { ...data.user, email: e.target.value } })}
          required
          className="form-input"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setData({ ...data, user: { ...data.user, password: e.target.value } })}
          required
          className="form-input"
        />
        <button type="submit" className="submit-button">Add User</button>
      </form>
    </div>
  );
}

export default AddUser;
