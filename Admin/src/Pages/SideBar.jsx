import React, { useState } from 'react'

function SideBar() {
  const [icon,seticon]=useState(false);
  const navToEmployeList=()=>{
    window.location.href="/#/employeeList"
  }
  const navToProfile=()=>{
    window.location.href="/#/Profile"
  }
  return (
    <>
        <div className='side-bar-icon' onClick={()=>seticon(!icon)}>Icon</div>

    {icon?
    <div className='side-bar'>

            <div className='side-bar-center'>
                    <h3 onClick={navToProfile}>Profile</h3>
                    <h3>Leave / Permission</h3>
                    <h3>Approval Requests</h3>
                    <h3>Reports</h3>
                    <h3 onClick={navToEmployeList}>Employee List </h3>
            </div>

            <div className='log-out'>Log out</div>
    </div>:<></>
    }
    </>
  )
}

export default SideBar