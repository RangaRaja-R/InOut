import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addOffSite } from '../Redux/actions/UserListAction';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Style/OffSite.css'; // Import the CSS file

function OffSite() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [locations, setLocations] = React.useState([]);
  const [data, setData] = useState({
    email: state.email,
    loc_id: null,
    loc_name: "",
    latitude: null,
    longitude: null,
    date: null,
  });
  const [name, setName] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(data)
    dispatch(addOffSite(data));
    navigate("/user-list");
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
    <div className="offsite-container">
      <h2>Add OffSite</h2>
      <form onSubmit={handleSubmit} className="offsite-form">
        {name &&
          <>
            <input
              type="number"
              required
              placeholder="Latitude"
              value={data.latitude}
              onChange={(e) => setData({ ...data, latitude: e.target.value })}
              className="form-input"
            />
            <input
              type="number"
              required
              placeholder="Longitude"
              value={data.longitude}
              onChange={(e) => setData({ ...data, longitude: e.target.value })}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Location Name"
              onChange={(e) => setData({ ...data, loc_name: e.target.value })}
              required
              className="form-input"
            />
          </>
        }
        <select
          onChange={(e) => {
            if (e.target.value === "New Location") {
              setData({ ...data, loc_id: null });
              setName(true);
              return;
            }
            setData({
              ...data,
              loc_id: locations[e.target.value].id,
              latitude: locations[e.target.value].latitude,
              longitude: locations[e.target.value].longitude,
            })
            setName(false);
          }}
          defaultValue={"Select Location"}
          className="form-input"
        >
          <option value="Select Location" disabled>Select Location</option>
          <option value="New Location">New Location</option>
          {locations.map((location, index) => (
            <option key={index} value={index}>
              {location.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          required
          value={data.date}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setData({ ...data, date: e.target.value })}
          className="form-input"
        />
        <button type="submit" className="submit-button">Add OffSite</button>
      </form>
    </div>
  );
}

export default OffSite;
