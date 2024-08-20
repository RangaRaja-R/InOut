import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch} from "react-redux";
import { login } from '../Redux/actions/AuthAction';
import '../Style/HrLogin.css';


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
    // navi("/user-list") 

  }
  return (
      <div className='LoginBox'>
        <div className='LoginHead'>
          <h2>Login</h2>
          <div className='LoginFields'>
          <form onSubmit={handleSubmit}>
          <input className='InputField' type='email' onChange={(e)=>setData({...data,email:e.target.value})} placeholder='USERNAME'/>
          <br /><br />
          <input className='InputField' type='text' onChange={(e)=>setData({...data,password:e.target.value})} placeholder='PASSWORD'/>
          <br /><br />
          <button type='submit' className='LoginButton'>Login</button>
          </form>
          </div>
        </div>
      </div>
  )
}

export default HrLogin