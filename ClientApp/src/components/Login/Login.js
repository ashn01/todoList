import React from 'react'

import {postServerWithData, LOGIN} from '../../APIROUTE'
import { BehaviorSubject } from 'rxjs';


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
        this.currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
        if(this.currentUserSubject.value)
        {
            this.props.history.push('/home');
        }
    }
    handleSubmit = (e) =>
    {
        e.preventDefault();
        
        postServerWithData(LOGIN, 
            {
                username:this.state.email,
                password:this.state.password
            }).then(res=>{
                    localStorage.setItem('currentUser', JSON.stringify(res.data));
                    this.currentUserSubject.next(res.data);
                    this.props.history.push("/home");
            }).catch(err=>{
                console.log("failed "+err)
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
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        )
    }
}