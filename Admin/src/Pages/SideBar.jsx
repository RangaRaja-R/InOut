import React from 'react'

function SideBar() {
  return (
    <div className='side-bar'>
            <div className='side-bar-icon'>Icon</div>

            <div className='side-bar-center'>
                    <h3>Profile</h3>
                    <h3>Leave / Permission</h3>
                    <h3>Approval Requests</h3>
                    <h3>Reports</h3>
                    <h3>Employee List </h3>
            </div>

            <div className='log-out'>Log out</div>
    </div>
  )
}

export default SideBar