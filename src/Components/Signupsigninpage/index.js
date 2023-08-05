import React, { useState } from 'react'
import "./style.css"
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { toast } from 'react-toastify';
import {  auth, db, doc, provider, setDoc } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { getDoc } from 'firebase/firestore';

function Signupsignin() {
  const [name,setName]=useState("");
  const [email, setEmail]=useState("");
  const [password, setPassword]=useState("");
  const [confirmpw, setConfirmpw]=useState("")
  const [loading, setLoading]=useState(false)
  const [loginform, setLoginform]=useState(false)
  const [loggedin, setLoggedin]=useState("false")
  
  const navigate=useNavigate()
  function loggingin(e){
    e.preventDefault();
    console.log(email);
    console.log(password);
    if(email!="" && password!=""){
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user); //use mail-psundarakrishna@gmail.com, pw- 123456
        navigate("/dashboard")
        setLoggedin("true")
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage)
      });
    }
    else{
      toast.error("All fields are mandatory")
    }
   
  }
  async function createDoc(user){
    if(!user) return;
    const userref=doc(db, "users",user.uid);
    const userdata=await getDoc(userref)
    if(!userdata.exists()){
      try{
        await setDoc(userref,{
        name: user.displayName? user.displayName:name,
        email:user.email,
        photoURL: user.photoURL?user.photoURL:"",
        createdAt: new Date(),    
        })
        toast.success("Doc created")
      }
      catch(e){
        toast.error(e.message())
      }
    }
    else{
      toast.error("Doc already exists")
    }
  }
   const signInWithGoogle = async (e) => {
    e.preventDefault()
    try{
      signInWithPopup(auth, provider)
      .then((result) => {  
              
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;        
        const user = result.user;
        console.log("User", user);
        setLoading(false)
        createDoc(user)
        toast.success("loggedin successfully with google")
        navigate("/dashboard")
      })
      .catch((error) => {       
        const errorCode = error.code;
        const errorMessage = error.message;        
        const email = error.customData.email;        
        const credential = GoogleAuthProvider.credentialFromError(error);
        toast.error(errorMessage)
      });
    }
    catch(e){
      toast.error(e.message)
    }
     
  };
  function setvalues(e){
    e.preventDefault()
    setLoading(true)
    console.log(name);
    console.log(email);
    console.log(password);
    console.log(confirmpw);
    const auth = getAuth();
    if(name!="" && email!=""&& password!=""&& confirmpw!=""){
      if(password==confirmpw){
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        // Signed in 
          const user = userCredential.user;
          console.log(user);
          toast.success("Created successfully")
          setLoading(false)
          createDoc(user)
          setEmail("")
          setName("")
          setConfirmpw("")
          setPassword("")
          navigate("/dashboard")
        // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage)
          setLoading(false)
        });
      }
      else{
        toast.error("Password and confirm password should be same")
        
      }
      
    }
    else{
      toast.error("All fields are mandatory")
      setLoading(false)
    }  

  }
  return (
    
    <div>
      {loginform?
      <form className='form'>
        <p>Login on precisely</p>
        
        <p className='mail'>Email</p>
        <input type='email' placeholder='Enter your email' id='mail' onChange={e=>setEmail(e.target.value)}></input>
        <p className='password'>Password</p>
        <input type='password' placeholder='Example123' id='password' onChange={e=>setPassword(e.target.value)}></input>
        
        <button onClick={loggingin}>Login with Email and Password</button>
        <p>or</p>
         <button className='google' onClick={signInWithGoogle} >Login with Google</button> 
        <p className='click' onClick={()=>setLoginform(!loginform)}>Or Don't have an account already?click here </p>
      </form>
        :
      <form className='form'>
        <p>Signup on precisely</p>
        <p className='name'>Full Name</p>
        <input type='text' placeholder='Enter your name' id='name' onChange={e=>setName(e.target.value)}></input> <br></br>
        <p className='mail'>Email</p>
        <input type='email' placeholder='Enter your password' id='mail' onChange={e=>setEmail(e.target.value)}></input>
        <p className='password'>Password</p>
        <input type='password' placeholder='Example123' id='password' onChange={e=>setPassword(e.target.value)}></input>
        <p className='password'>Confirm Password</p>
        <input type='password' placeholder='Example123' id='password' onChange={e=>setConfirmpw(e.target.value)}></input>
        <button onClick={setvalues}>Sign Up with Email and Password</button>
        <p>or</p>
        <button className='google' onClick={signInWithGoogle} >Sign Up with Google</button> 
        <p className='click' onClick={()=>setLoginform(!loginform)}>Or have an account already click here</p>
      </form>}
    </div>
      
  )
}

export default Signupsignin