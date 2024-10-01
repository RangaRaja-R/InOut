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

function Routing() {
  return (
    <>

    <SideBar/>
    
   <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/admin-sign-in" element={<AdminLogin />} />
    <Route path="/department-list" element={<DepartmentList/>}/>
    <Route path="/employeeList" element={<UserList/>}/>
    <Route path='/offsite' element={<OffSite/> } />
    <Route path="/add-user" element={<AddUser/>}/>
    <Route path="/profile" element={<Profile/>}/>
    <Route path="/attendance" element={<Attendance/>}/>
   </Routes>
    </>
  )
}

export default Routing;