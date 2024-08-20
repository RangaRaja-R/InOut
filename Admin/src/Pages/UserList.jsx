import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '../Redux/actions/UserListAction';

function UserList() {
  const dispatch=useDispatch();
  const selector=useSelector(state=>state.users);
  useEffect(()=>{
    dispatch(getAllUsers());

  },[])
  if(selector.users){
    console.log(selector.users);
  }
  return (
    <div>
          <div><h2>Employee List</h2></div>
          

    </div>
  )
}

export default UserList