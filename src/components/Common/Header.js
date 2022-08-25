import React, { Component } from "react";
import '../../Styles/header.css'
import { Link } from 'react-router-dom';


export default class Header extends Component {


  handleLogout(e){
         e.preventDefault();
       window.localStorage.removeItem("token");
       alert("logged out")
         console.log("token removed");
   }
   
   
   render() {
     return (
    <div className='header'>
      <Link to='/'>
        <div className="s-logo">
            e!
        </div>
        </Link>
         <div className='btn-group login-block'>
         <Link to='/sign-in' style={{textDecoration: 'none'}}><span className='login' >Login</span></Link>
           
           <Link to='/' style={{textDecoration: 'none'}}>
            <div className='logout' onClick={(e)=>this.handleLogout(e)}>Logout</div>
            </Link> 
         </div>
         <Link to='/sign-up' style={{textDecoration: 'none'}}> <span className='signUp'>Create an account</span></Link>
       
    </div>
   );
  }
}