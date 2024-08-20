import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'

function Home() {
  
    const navi=useNavigate();
  return (
    <div>Home
    <button onClick={()=>navi("/admin-sign-in")}>AdminLogin</button>
    <button onClick={()=>navi("/hr-sign-in")}>Hr Login</button>
    

    </div>
  )
}

export default Home