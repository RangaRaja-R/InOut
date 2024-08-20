import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '../Redux/actions/UserListAction';

function UserList() {
  const dispatch=useDispatch();
  const selector=useSelector(state=>state.user);
  const userlist=useSelector(state=>state.users);
  useEffect(()=>{
    if(selector.user){

      dispatch(getAllUsers());
    }
  },[])
  
  return (
    <div>
          <div><h2>Employee List</h2></div>
          <div><button>Add User</button></div>
          <div>

          {userlist.users?
              userlist.users.map((u,index)=>{
                return (
                  <div key={index}>
                  <p>{u.user.name}</p>
                  <p>{u.user.email}</p>
                  <button>Off Site</button>
                  </div>
                )
              }):<div>Loading</div>
          }
          </div>

    </div>
  
  )
}

export default UserList