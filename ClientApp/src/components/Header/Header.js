import React from 'react'
import { Link, Redirect } from 'react-router-dom';
import $ from 'jquery'
import store from '../../store'

import authenticationService from '../../services/Authentication'

export default class Header extends React.PureComponent
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
          toLogin: false
        };
        this.unsubscribe={};
    }

    componentDidMount() 
    {
        var info = store.getState().userInfo
        this.setState({currentUser:info})
        $('#headNav .nav-item').click((e)=>{
            $('#headNav .nav-item').removeClass('active');
            $(e.target).addClass('active');
        })

        authenticationService.validate().then(res=>{
            console.log(res)
        }).catch(err=>{
            this.setState({toLogin:true})
        })
    }

    logout=()=> {
        authenticationService.logout()
        this.setState({toLogin : true})
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
                            <Link to="/home" className="nav-item nav-link active">OnGoing</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/home" className="nav-item nav-link">Completed</Link>
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
                            <Link to="/login" onClick={this.logout} className="nav-item nav-link">Logout</Link>
                        </li>
                    </ul>
                </div>
            </nav> 
        )
    }
}