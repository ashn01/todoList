import React from 'react'
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import {Spinner} from 'react-bootstrap'

import { setInfo } from "../../Stores/Reducers/userInfo";

import authenticationService from '../../services/Authentication'

import '../../css/Login.css'

class Login extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.state =
        {
            email:"",
            password:"",
            toLogin : false,
            toRegister : false,
            isLoaded : true
        }

    }
    handleSubmit = (e) =>
    {
        e.preventDefault();
        this.setState({isLoaded : false})
        authenticationService.login(this.state.email,this.state.password).then(res=>{
            this.props.setInfo(res.id, res.email, res.firstName, res.lastName)
            this.setState({toLogin:true})
        }).catch(err=>{
            this.setState({isLoaded : true})
        })
    }

    handleRegister = () =>
    {
        this.setState({toRegister:true})
    }

    handleChange = (e) =>
    {
        this.setState({
            [e.target.id]:e.target.value
        })
    }

    componentDidMount()
    {
        authenticationService.validate().then(res=>{
            this.setState({toLogin:true})
        }).catch(err=>{
            //console.log(err)
        })
    }

    render()
    {
        if(this.state.toRegister === true)
        {
            return <Redirect to='/register'/>
        }
        if(this.state.toLogin === true)
        {
            return <Redirect to='/home'/>
        }
        return (
            <div className="main">
                <div className="login">
                    <div className="jumbotron">
                        <h3>Doobi-Do!</h3>
                    </div>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <input autoFocus type="email" className="form-control" placeholder="Email address"
                            id="email" onChange={e=>this.handleChange(e)}/>
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control " placeholder="Password"
                            id="password" onChange={e=>this.handleChange(e)}/>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">Login</button>
                        <button type="button" className="btn btn-primary btn-block" onClick={this.handleRegister}>Register</button>
                    </form>
                </div>
                <div className={`hideBack ${this.state.isLoaded ? "" : "active"}`}>
                    <div className="spinnerContainer">
                        <Spinner animation="border" variant="primary" />    
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    null,
    {setInfo}
)(Login)