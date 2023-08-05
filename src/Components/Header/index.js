import React, { useEffect } from 'react'
import "./style.css"
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth,options } from '../../firebase';
import { GoogleAuthProvider, signOut } from 'firebase/auth';
import { toast } from 'react-toastify';

function Header() { 
  const [user] = useAuthState(auth); 
  const navigate=useNavigate();
  useEffect(()=>{
    if(user){
      navigate("/dashboard")
    }
    
  },[user])
  



  function logoutfun(){    
    try{
      signOut(auth).then(() => {
        // Sign-out successful.
        navigate("/")
        toast.success("Signedout successfully")
      }).catch((error) => { 
        toast.error(error.message)
      }); 
    }
    catch(e){
        toast.error(e.message)
    }
      
  }
  
  return (
    <div className='navbar'>
      <div className='left'>
        Finance tracker
      </div>
      {user && 
      <div className='image'>
        <img src={user.photoURL}></img>
      <div className='right' onClick={logoutfun}>Logout</div> 
      </div>
      }
      
      
    </div>
  )
}

export default Header