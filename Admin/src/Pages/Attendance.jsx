import React from 'react'
import "../Style/Attendance.css"
function Attendance() {
  return (
    <div>
            <div>
                <p>Attendance List</p>
            </div>
            <div className='table-head'>
                <h4>Check-In</h4>
                <h4>Check-Out</h4>
                <h4>Working Hours</h4>
            </div>
    </div>
  )
}

export default Attendance