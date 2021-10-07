import React from 'react'
import {HashRouter,Route,Switch,Redirect ,withRouter} from "react-router-dom"

 function Login(props) {
    return (
        <div>     
            <button onClick={()=>{
            localStorage.setItem("token","123")
            props.history.replace("/")
           
         
            }}>按钮 </button>
        </div>
    )
}
export default withRouter(Login)
