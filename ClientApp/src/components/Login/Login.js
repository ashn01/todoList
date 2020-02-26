import React from 'react'

import authenticationService from '../../services/Authentication'

export default class Login extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.state =
        {
            email:"",
            password:""
        }

        if (authenticationService.currentUserValue) { 
            this.props.history.push('/home');
        }
    }
    handleSubmit = (e) =>
    {
        e.preventDefault();
        authenticationService.login(this.state.email,this.state.password).then(res=>{
            this.props.history.push("/home")
        })
    }

    handleChange = (e) =>
    {
        this.setState({
            [e.target.id]:e.target.value
        })
    }

    render()
    {
        return (
            <div className="container-fluid">
                <div className="jumbotron">
                    <h3>Todo List</h3>
                </div>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input autoFocus type="email" className="form-control" 
                        id="email" onChange={e=>this.handleChange(e)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" 
                        id="password" onChange={e=>this.handleChange(e)}/>
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                    <button type="button" className="btn btn-primary" onClick={()=>this.props.history.push("/register")}>Register</button>
                </form>
            </div>
        )
    }
}