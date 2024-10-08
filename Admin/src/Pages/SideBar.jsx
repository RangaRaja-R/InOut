import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../Redux/actions/AuthAction';
import '../Style/SideBar.css';

function SideBar() {
  const dispatch = useDispatch();
  const selector = useSelector(state => state.user);
  const [icon, setIcon] = useState(false);

  const navToEmployeList = () => {
    window.location.href = "/#/employeeList";
  };

  const navToProfile = () => {
    window.location.href = "/#/Profile";
  };

  const logOutHandle = () => {
    dispatch(logout());
    window.location.href = "";
  };

  const toggleSidebar = () => {
    setIcon(!icon); // Toggle sidebar open/close
  };

  return (
    <div>
      <div className={`side-bar-icon`} onClick={toggleSidebar}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={icon ? "#e8eaed" : "#000"}><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>
      </div>

      <div className={`side-bar ${icon ? 'show' : ''}`}>
        <div className='side-bar-center'>
          <h3 onClick={navToProfile}>Profile</h3>
          <h3>Leave / Permission</h3>
          <h3>Approval Requests</h3>
          <h3>Reports</h3>
          <h3 onClick={navToEmployeList}>Employee List</h3>
        </div>
        <div className='log-out'>
          <svg onClick={logOutHandle} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" /></svg>
          <h3>Log out</h3>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
