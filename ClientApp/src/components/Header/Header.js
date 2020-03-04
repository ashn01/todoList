import React from 'react'
import { Link, Redirect } from 'react-router-dom';
import $ from 'jquery'

import {store, persistor} from '../../store'
import { connect } from "react-redux";
import { setHeader } from "../../Stores/Reducers/headerPanel";

import authenticationService from '../../services/Authentication'

class Header extends React.PureComponent
{
    constructor(props) {
        super(props);
    
        this.state = {
          currentUser: {
              id:"",
              email:"",
              firstName:"",
              lastName:""
          },
          panelIndex : 0,
          toLogin: false
        };
        this.unsubscribe = store.subscribe(()=>{
            this.setState({
                panelIndex : store.getState().headerPanel.index
            })
        })
    }

    componentDidMount() 
    {
        var info = store.getState().userInfo
        this.setState({currentUser:info})

        authenticationService.validate().then(res=>{
            //console.log(res)
        }).catch(err=>{
            this.setState({toLogin:true})
        })
    }

    componentWillUnmount()
    {
        this.unsubscribe()
    }

    handleSwitch = (index) =>{
        this.setState({panelIndex : index},()=>{
            this.props.setHeader(this.state.panelIndex)
        })
    }

    logout=()=> {
        authenticationService.logout()
        persistor.purge()
        //this.setState({toLogin : true})
    }

    render()
    {
        if(this.state.toLogin === true)
        {
            return <Redirect to="/login"/>
        }
        return(
            <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                <div className="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
                    <ul id="headNav" className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to="/home" onClick={()=>this.handleSwitch(0)} className={`nav-item nav-link ${this.state.panelIndex===0 ? "active" :""}`}>OnGoing</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/home" onClick={()=>this.handleSwitch(1)} className={`nav-item nav-link ${this.state.panelIndex===1 ? "active" :""}`}>Completed</Link>
                        </li>
                    </ul>
                </div>
                <div className="mx-auto order-0">
                    <Link to="/home" className="navbar-brand">{this.state.currentUser.firstName+" "+this.state.currentUser.lastName+"'s"} Todos</Link>
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
                            <Link to="/login" onClick={this.logout} className="nav-item nav-link">Logout</Link>
                        </li>
                    </ul>
                </div>
            </nav> 
        )
    }
}


export default connect(
    null,
    {setHeader}
)(Header)