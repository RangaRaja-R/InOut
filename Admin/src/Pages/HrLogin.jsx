import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch} from "react-redux";
import { login } from '../Redux/actions/AuthAction';


function HrLogin() {
  const dispatch=useDispatch();
  const [data,setData]=useState({
    email: "",
    password: "",
  });
  const navi=useNavigate();
  const handleSubmit=(e)=>{
    e.preventDefault();
    dispatch(login(data));

  }
  return (
    <div>
    <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input type='email' onChange={(e)=>setData({...data,email:e.target.value})}/>
          <input type='text' onChange={(e)=>setData({...data,password:e.target.value})}/>
    <button onClick={()=>navi("/user-list") } type='submit' >Login</button>
        </form>
    </div>


    </div>
  )
}

export default HrLogin