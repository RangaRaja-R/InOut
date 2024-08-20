import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../Redux/actions/AuthAction';

function NavBar() {
    const selector = useSelector(state => state.user);
    const dispatch=useDispatch();
    const HandleLogout=()=>{
            dispatch(logout());
    }
  return (<>

    <div>NavBar</div>
    {(selector.user)?<div>{selector.user.name}<button onClick={HandleLogout}>logout</button></div>:<></>}
  </>
  )
}

export default NavBar