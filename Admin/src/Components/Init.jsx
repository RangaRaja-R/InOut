import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';


export default function Init(){
    const dispatch=useDispatch();
  const selector=useSelector(state=>state.user);
  useEffect(()=>{
      if(selector.user){
          dispatch(getAllUsers());  
        }

  },[])

    return null;
}
