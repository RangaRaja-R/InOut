import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminLogin from './Pages/AdminLogin'
import Home from './Pages/Home'
import HrLogin from './Pages/HrLogin'
import DepartmentList from './Pages/DepartmentList'
import UserList from './Pages/UserList'
import NavBar from './Components/NavBar'

function Routing() {
  return (
    <>

    <NavBar/>
   <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/admin-sign-in" element={<AdminLogin />} />
    <Route path="/hr-sign-in" element={<HrLogin />} />
    <Route path="/department-list" element={<DepartmentList/>}/>
    <Route path="/user-list" element={<UserList/>}/>
   </Routes>
    </>
  )
}

export default Routing;