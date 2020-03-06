import React, { useState } from 'react'
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import {Spinner} from 'react-bootstrap'

import Home from './Home/Home'
import Login  from './Login/Login';
import Register  from './Login/Register';

import 'react-toastify/dist/ReactToastify.css';
import '../css/Common.css'

export default function Main (props)
{
    const showSpinner = useSelector(state => state.spinnerReducer.show)
    const [content, setContent] = useState(props.contents)
    
    React.useEffect(()=>{
        setContent(props.contents)
    },[props])

    const renderWhat=()=>
    {
        switch(content)
        {
            case 'home' : 
            return <Home/> 
            case 'login' : 
            return <Login/>
            case 'register' : 
            return <Register/>
            default : 
            return null
        }
    }
    return(
        <div className="mainComponent">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop 
                                closeOnClick rtl={false} pauseOnVisibilityChange
                                draggable pauseOnHover
            />
            {
                renderWhat()
            }
            <div className={`hideBack ${showSpinner ?  "":""}`}>
                <div className="spinnerContainer">
                    <Spinner animation="border" variant="primary" />    
                </div>
            </div>
        </div>
    )
}