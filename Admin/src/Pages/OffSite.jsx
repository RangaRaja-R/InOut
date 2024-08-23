import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addOffSite } from '../Redux/actions/UserListAction';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Style/OffSite.css'; // Import the CSS file

function OffSite() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch();

  const [data, setData] = useState({
    email: state.email,
    latitude: null,
    longitude: null,
    date: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addOffSite(data));
    navigate("/user-list");
  };

  return (
    <div className="offsite-container">
      <h2>Add OffSite</h2>
      <form onSubmit={handleSubmit} className="offsite-form">
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
          type="date"
          required
          value={data.date}
          onChange={(e) => setData({ ...data, date: e.target.value })}
          className="form-input"
        />
        <button type="submit" className="submit-button">Add OffSite</button>
      </form>
    </div>
  );
}

export default OffSite;
