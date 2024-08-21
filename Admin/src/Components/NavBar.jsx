import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../Redux/actions/AuthAction';
import '../Style/NavBar.css';
import { useNavigate } from 'react-router-dom'

function NavBar() {
    const selector = useSelector(state => state.user);
    const dispatch=useDispatch();
    const navi = useNavigate();
    const HandleLogout=()=>{
      dispatch(logout());
      navi('/')
    }
    // text-transform:capitalise
  return (<>

    <div className='Navbar'>
    <div className='CompanyName'>INOUT</div>
    <div>
    {(selector.user)?
      <div className='RightContent'>
      <div className='UserName'>{selector.user.name}
      </div>
      <button onClick={HandleLogout} className='logOut'>Logout</button></div>
      :
      <></>}
    </div>
    </div>
  </>
  )
}

export default NavBar