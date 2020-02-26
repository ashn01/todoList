import React from 'react'
import { Link } from 'react-router-dom';
import $ from 'jquery'

import  history  from '../../helpers/history';
import authenticationService from '../../services/Authentication'

export default class Header extends React.PureComponent
{
    constructor(props) {
        super(props);
    
        this.state = {
          currentUser: null
        };
    }

    componentDidMount() {
        $('#headNav .nav-item').click((e)=>{
            $('#headNav .nav-item').removeClass('active');
            $(e.target).addClass('active');
        })

        authenticationService.currentUser.subscribe(x => this.setState({
          currentUser: x
        }));

       
      }

    logout() {
        authenticationService.logout()
        history.push('/login');
    }

    render()
    {
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
                    <Link to="/home" className="navbar-brand">My Todos</Link>
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