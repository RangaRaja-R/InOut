import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../Redux/actions/AuthAction';
import MenuIcon from '@mui/icons-material/Menu';
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
    <>
      <div className={`side-bar-icon`} onClick={toggleSidebar}>
        <MenuIcon />
      </div>

      <div className={`side-bar ${icon ? 'show' : ''}`}>
        <div className='side-bar-center'>
          <h3 onClick={navToProfile}>Profile</h3>
          <h3>Leave / Permission</h3>
          <h3>Approval Requests</h3>
          <h3>Reports</h3>
          <h3 onClick={navToEmployeList}>Employee List</h3>
        </div>
          <h3 className='log-out' onClick={logOutHandle}>Log out</h3>
      </div>
    </>
  );
}

export default SideBar;
