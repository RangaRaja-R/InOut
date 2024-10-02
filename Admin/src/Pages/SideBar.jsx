import React, { useState } from 'react'
import { useDispatch,useSelector } from 'react-redux';
import { logout } from '../Redux/actions/AuthAction';
function SideBar() {
  const dispatch = useDispatch();
  
  const selector=useSelector(state=>state.user);
  const [icon,seticon]=useState(false);
  const navToEmployeList=()=>{
    window.location.href="/#/employeeList"
  }
  const navToProfile=()=>{
    window.location.href="/#/Profile"
  }
  const logOutHandle=()=>{
    console.log(selector.user);
    dispatch(logout());
    console.log(selector.user);
    window.location.href=""

  }
  return (
    <>
        <div className='side-bar-icon' onClick={()=>seticon(!icon)}> I am the side bar Icon</div>

    {icon?
    <div className='side-bar'>

            <div className='side-bar-center'>
                    <h3 onClick={navToProfile}>Profile</h3>
                    <h3>Leave / Permission</h3>
                    <h3>Approval Requests</h3>
                    <h3>Reports</h3>
                    <h3 onClick={navToEmployeList}>Employee List </h3>
            </div>

            <div className='log-out' onClick={logOutHandle}>Log out</div>
    </div>:null
    }
    </>
  )
}

export default SideBar