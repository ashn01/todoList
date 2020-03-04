import React from 'react'
import { Redirect } from 'react-router-dom';

import {postServerWithData , REGISTER} from '../../APIROUTE'

export default class Register extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.state =
        {
            email:"",
            password:"",
            confirmPassword:"",
            firstname:"",
            lastname:"",
            toLogin : false
        }
    }

    /*  handleSubmit(e:element)
     *  send user info to server
     *  if successful, redirect to login page
    */
    handleSubmit = (e) =>
    {
        if (this.state.password === this.state.confirmPassword) 
        {
            e.preventDefault();
            postServerWithData(REGISTER, {
                email: this.state.email,
                password: this.state.password,
                firstname: this.state.firstname,
                lastname: this.state.lastname
            }).then(res => {
                this.handleLogin()
            }).catch(err => {
                console.log(err)
            })
        } else 
        {
            console.log("Password not match")
        }
    }

    /*  handleLogin()
     *  redirect to login page
    */
    handleLogin = () =>
    {
        this.setState({toLogin:true})
    }

    /*  handleChange(e:element)
     *  Change state with element value
    */
    handleChange = (e) =>
    {
        this.setState({
            [e.target.id]:e.target.value
        })
    }

    render()
    {
        if(this.state.toLogin === true)
        {
            return <Redirect to='/login'/>
        }
        return (
            <div className="main">
                <div className="register">
                    <div className="jumbotron">
                        <h3>Doobi-Do!</h3>
                    </div>
                    <form>
                        <div className="form-group">
                            <input autoFocus type="email" className="form-control" placeholder="Email address"
                            id="email" onChange={e=>this.handleChange(e)} value={this.state.email}/>
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" placeholder="Password"
                            id="password" onChange={e=>this.handleChange(e)} value={this.state.password}/>
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" placeholder="Confirm Password"
                            id="confirmPassword" onChange={e=>this.handleChange(e)} value={this.state.confirmPassword}/>
                        </div>
                        <div className="form-group">
                            <input autoFocus type="firstname" className="form-control" placeholder="First Name"
                            id="firstname" onChange={e=>this.handleChange(e)} value={this.state.firstname}/>
                        </div>
                        <div className="form-group">
                            <input autoFocus type="lastname" className="form-control" placeholder="Last Name"
                            id="lastname" onChange={e=>this.handleChange(e)} value={this.state.lastname}/>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={this.handleLogin}>Cancel</button>
                        <button type="button" className="btn btn-primary float-right" onClick={this.handleSubmit}>Submit</button>
                    </form>
                </div>
            </div>
        )
    }
}

