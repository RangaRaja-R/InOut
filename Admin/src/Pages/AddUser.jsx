import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { postUser } from '../Redux/actions/UserListAction';
import { useNavigate } from 'react-router-dom'

function AddUser() {
  const navi=useNavigate();
  const dispatch=useDispatch();
  const [data,setData]=useState({
    latitude:0.0,
    longitude:0.0,
    user:{
      name:'',
      email:'',
      password:'',
      role:"employee"
    }

  });
const handleSubmit=(event)=>{
  console.log(data);
  event.preventDefault();
  if(data.latitude===0.0  || data.longitude===0.0){

  getLocation();
  }
  dispatch(postUser(data));
  navi("/user-list");
}
const getLocation=()=>{
  if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position)=>{
    setData({
      ...data,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  })
  }
  else{
      alert("Please allow the location for the task Location");
  }
}
  return (
    <div>
      <div>
        <h1>Add User</h1>
        <form onSubmit={handleSubmit}>
          <button  onClick={getLocation}>Current Location</button>
          <input type='text' placeholder='username' onChange={(e)=>setData({...data,user:{...data.user,name:e.target.value}})} required/>
          <input type='email' placeholder='email' onChange={(e)=>setData({...data,user:{...data.user,email:e.target.value}})} required/>
          <input type='password' placeholder='password'  onChange={(e)=>setData({...data,user:{...data.user,password:e.target.value}})} required/>
          <button type='submit'>Add User</button>
        </form>
      </div>
    </div>
  )
}

export default AddUser