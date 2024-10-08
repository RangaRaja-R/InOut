import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminLogin from './Pages/AdminLogin'
import Home from './Pages/Home'
import HrLogin from './Pages/HrLogin'
import DepartmentList from './Pages/DepartmentList'
import UserList from './Pages/UserList'
import NavBar from './Components/NavBar'
import OffSite from './Pages/OffSite'
import AddUser from './Pages/AddUser'
import Attendance from './Pages/Attendance'
import SideBar from './Pages/SideBar'
import Profile from './Pages/Profile'
import { useDispatch, useSelector} from "react-redux";
function Routing() {
      
  const selectorUser=useSelector(state=>state.user);
  return (
    <div style={{display:'flex' ,flexDirection:'row'}}>
    {selectorUser.user &&( <SideBar/>)}
    
   <Routes>
    <Route path="/" element={<AdminLogin />} />
    {selectorUser.user &&
      (<>
        <Route path="/home" element={<Home />} />
        <Route path="/department-list" element={<DepartmentList/>}/>
        <Route path="/employeeList" element={<UserList/>}/>
        <Route path='/offsite' element={<OffSite/> } />
        <Route path="/add-user" element={<AddUser/>}/>
        {/* <Route path="/profile" element={<Profile/>}/> */}
        <Route path="/attendance" element={<Attendance/>}/>
      </>)
    }
   </Routes>
    </div>
  )
}

export default Routing;