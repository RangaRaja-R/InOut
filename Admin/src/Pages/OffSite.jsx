import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { addOffSite } from '../Redux/actions/UserListAction';
import { useLocation, useNavigate } from 'react-router-dom';

function OffSite() {
  const navi=useNavigate();
  const {state}=useLocation();
  const dispatch=useDispatch();
  console.log(state.email);
  const [data,setdata]=useState({
    email:state.email,
    latitude:0.0,
    longitude:0.0,
    date:null
  });
  const handleSubmit=(e)=>{
    e.preventDefault();
    dispatch(addOffSite(data));
    navi("/user-list");
  }
  return (
    <div>

    <h2>Add OffSite</h2>
    <form onSubmit={handleSubmit}>
        <input type='number' required placeholder='latitude' onChange={(e)=>setdata({...data,latitude:e.target.value})}/>
        <input type='number' required placeholder='longitude'    onChange={(e)=>setdata({...data,longitude:e.target.value})}/>
        <input type='date' required placeholder='date'  onChange={(e)=>setdata({...data,date:e.target.value})}/>
        <button type='submit' >Add OffSite</button>

    </form>
    </div>
  )
}

export default OffSite