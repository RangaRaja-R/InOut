import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../Redux/actions/UserListAction';
import '../Style/UserList.css';
import { useNavigate } from 'react-router-dom';
import { getQrCode, validate } from '../Redux/actions/AuthAction';

function UserList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selector = useSelector(state => state.user);
  const userlist = useSelector(state => state.users);

  
  const [qrVisible, setQrVisible] = useState(false);
  const [qrData, setQrData] = useState({
      email:null,
      name:null,
}); 

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

  
  const showTheQr = (email,name) => {
    setQrData({email:email,name:name}); 
    dispatch(getQrCode(email));
    setQrVisible(true); 
  };

  
  const handleCancelQr = () => {
    setQrVisible(false);
    setQrData(null); 
  };


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
              <td>{u.id}</td>
              <td>{stampConverter(u.check_in,1)}</td>
              <td>{u.status?"Active":"Inactive"}</td>
              <td>{stampConverter(u.check_in,0)}</td>
              <td>{stampConverter(u.check_out,0)}</td>
              <td>
                <button className="offsite-button" onClick={() => handleOffSite(u.email)}>Off Site</button>
                <button className="offsite-button" onClick={() => showTheQr(u.email,u.name)}>Qr Code</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {qrVisible && (
        <div className="qr-code-modal">
          <div className="qr-code-content">
            <span className="qr-code-title">QR Code for {qrData.name}</span>
           
            
             <img 
              src={selector.img}
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
