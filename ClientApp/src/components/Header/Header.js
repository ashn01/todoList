import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom';

import { persistor} from '../../store'
import { useDispatch, useSelector } from "react-redux";
import { setHeader } from "../../Stores/Reducers/headerPanel";

import authenticationService from '../../services/Authentication'


export default function Header()
{
    const panelIndex = useSelector(state=>state.headerPanel.index)
    const info = useSelector(state=>state.userInfo)
    const [toLogin, setToLogtin] = useState(false)

    const dispatch = useDispatch()

    React.useEffect(()=>{
        authenticationService.validate()
        .then(res=>{

        }).catch(err=>{
            setToLogtin(true)
        })
    },[])

    /*  handleSwitch(index:number)
     *  set header index ongoing or completed
    */
    const handleSwitch = (index) =>{
        dispatch(setHeader(index))
    }

    /*  logout()
     *  logout
    */
    const logout=()=> {
        authenticationService.logout()
        persistor.purge()
    }

    if(toLogin === true)
    {
        return <Redirect to="/login"/>
    }
    return(
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
            <div className="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
                <ul id="headNav" className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link to="/home" onClick={()=>handleSwitch(0)} className={`nav-item nav-link ${panelIndex===0 ? "active" :""}`}>OnGoing</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/home" onClick={()=>handleSwitch(1)} className={`nav-item nav-link ${panelIndex===1 ? "active" :""}`}>Completed</Link>
                    </li>
                </ul>
            </div>
            <div className="mx-auto order-0">
                <Link to="/home" className="navbar-brand">{info.firstName+" "+info.lastName+"'s"} Todos</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse2">
                    <span className="navbar-toggler-icon"></span>
                </button>
            </div>
            <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link to="/setting" className="nav-item nav-link">Setting</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/login" onClick={()=>logout()} className="nav-item nav-link">Logout</Link>
                    </li>
                </ul>
            </div>
        </nav> 
    )    
}