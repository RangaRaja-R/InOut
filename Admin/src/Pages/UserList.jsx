import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '../Redux/actions/UserListAction';
import '../Style/UserList.css'
import { useNavigate } from 'react-router-dom';

function UserList() {
  const navi=useNavigate();
  const dispatch=useDispatch();
  const selector=useSelector(state=>state.user);
  const userlist=useSelector(state=>state.users);
  useEffect(()=>{
    if(selector.user){

      dispatch(getAllUsers());  
    }
  },[])
  

  const HandleOffSite=(email,e)=>{
    
      navi("/offsite", {state:{email}});
  }
  const HandleAddUser=()=>{
    navi("/add-user");
  }
  return (
    <div>
          <div><h2>Employee List</h2></div>
          <div><button onClick={HandleAddUser}>Add User</button></div>
          <div>

          {userlist.users?
              userlist.users.map((u,index)=>{
                return (
                  <div className='details' key={index} onClick={()=>{navi("/attendance")}}>
                  <p>{u.user.name}</p>
                  <p>{u.user.email}</p>
                  <button onClick={()=>{HandleOffSite(u.user.id)}}>Off Site</button>
                  </div>
                )
              }):<div>Loading</div>
          }
          </div>

    </div>
  
  )
}

export default UserList