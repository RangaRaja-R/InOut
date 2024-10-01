import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../Redux/actions/UserListAction';
import '../Style/UserList.css';
import { useNavigate } from 'react-router-dom';
import { validate } from '../Redux/actions/AuthAction';

function UserList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selector = useSelector(state => state.user);
  const userlist = useSelector(state => state.users);

  // State to track QR code visibility
  const [qrVisible, setQrVisible] = useState(false);
  const [qrEmail, setQrEmail] = useState(null); // Store email for displaying the QR code

  useEffect(() => {
    if (selector.user) {
      dispatch(getAllUsers());
    }
  }, [dispatch, selector.user]);

  const handleOffSite = (email) => {
    navigate("/offsite", { state: { email } });
  };

  const handleValidate = (email) => {
    dispatch(validate(email));
  };

  const handleAddUser = () => {
    navigate("/add-user");
  };

  const stampConverter = (check,boole) => {
    if (check === null) {
      return "-";
    } 
    let formattedDateTime;
    if(boole){
    formattedDateTime = new Date(check).toLocaleString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
        // hour: "2-digit",
        // minute: "2-digit",
        // hour12: true,
      }
    );}
    else{
      formattedDateTime = new Date(check).toLocaleString(
        "en-US",
        {
          
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
      )
    }
    return formattedDateTime;
  };

  // Show QR code for the selected email
  const showTheQr = (email) => {
    setQrEmail(email); // Set email for QR code generation (if required)
    setQrVisible(true); // Show the QR code modal
  };

  // Hide the QR code modal
  const handleCancelQr = () => {
    setQrVisible(false);
    setQrEmail(null); // Clear email when the modal is closed
  };

  // Fallback to exampleUsers if userlist.users is null or empty
  const usersToShow = userlist.users && userlist.users.length > 0 ? userlist.users : [
    { name: 'John Doe', email: 'john@example.com', check_in: '2024-10-01T09:30:00', check_out: '2024-10-01T17:00:00' ,status:1},
    { name: 'Jane Smith', email: 'jane@example.com', check_in: '2024-10-01T09:45:00', check_out: '2024-10-01T16:50:00' ,status:0},
  ];

  return (
    <div className="user-list-container">
      <h1>InOut</h1>
      <h2>Employee List</h2>
      <button className="add-user-button" onClick={() => { dispatch(getAllUsers()) }}>Refresh</button>
      <button className="add-user-button" onClick={handleAddUser}>Add User</button>
      <table className="user-list-table">
        <thead>
          <tr>
            <th>Emp Name</th>
            <th>Emp Email</th>
            <th>Emp Id</th>
            <th>Date</th>
            <th>Status</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {usersToShow.map((u, index) => (
            <tr key={index} className="table-row">
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.email}</td>
              <td>{stampConverter(u.check_in,1)}</td>
              <td>{u.status?"Active":"Inactive"}</td>
              <td>{stampConverter(u.check_in,0)}</td>
              <td>{stampConverter(u.check_out,0)}</td>
              <td>
                <button className="offsite-button" onClick={() => handleOffSite(u.email)}>Off Site</button>
                <button className="offsite-button" onClick={() => showTheQr(u.email)}>Qr Code</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Conditionally render QR code modal */}
      {qrVisible && (
        <div className="qr-code-modal">
          <div className="qr-code-content">
            <span className="qr-code-title">QR Code for {qrEmail}</span>
            <img 
              src="https://img.freepik.com/free-vector/scan-me-qr-code_78370-2915.jpg?size=338&ext=jpg&ga=GA1.1.1819120589.1727654400&semt=ais_hybrid" // Replace this with actual QR code image or dynamically generate it
              alt="QR Code"
              className="qr-code-image"
            />
            <button className="cancel-button" onClick={handleCancelQr}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;
