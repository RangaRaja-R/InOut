import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { postUser } from '../Redux/actions/UserListAction';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Style/AddUser.css'; // Import the CSS file

function AddUser() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState({
    loc_id: null,
    office_name: '',
    latitude: 0.0,
    longitude: 0.0,
    user: {
      name: '',
      email: '',
      password: '',
      role: "employee"
    }
  });
  const [locations, setLocations] = React.useState([]);
  const [name, setName] = useState(false);

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
      setName(true);
      navigator.geolocation.getCurrentPosition((position) => {
        setData({
          ...data,
          loc_id: null,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      alert("Please allow the location for the task Location");
    }
  };

  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await axios.get("http://localhost:8000/locations");
        console.log(res);
        setLocations(res.data);
      } catch (err) {
        console.log(err)
      }
    }
    fetchLocations()
  }, [])

  return (
    <div className="add-user-container">
      <h1>Add User</h1>
      <form onSubmit={handleSubmit} className="add-user-form">
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
        {name &&
          <input
            type="text"
            placeholder="Location Name"
            onChange={(e) => setData({ ...data, loc_name: e.target.value })}
            required
            className="form-input"
          />
        }
        <select
          onChange={(e) => {
            if (e.target.value === "Current Location") {
              getLocation();
              return;
            }
            setData({
              ...data,
              loc_id: locations[e.target.value].id,
              latitude: locations[e.target.value].latitude,
              longitude: locations[e.target.value].longitude,
            })
            console.log(locations[e.target.value]);
            setName(false);
          }}
          defaultValue={"Select Location"}
          className="form-input"
        >
          <option value="Select Location" disabled>Select Location</option>
          <option value="Current Location">Current Location</option>
          {locations.map((location, index) => (
            <option key={index} value={index}>
              {location.name}
            </option>
          ))}
        </select>
        {/* <button type="button" onClick={getLocation} className="location-button">Current Location</button> */}
        <button type="submit" className="submit-button">Add User</button>
      </form>
    </div>
  );
}

export default AddUser;
