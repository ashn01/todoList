import React from 'react'

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
            firstname:"",
            lastname:""
        }
    }
    handleSubmit = (e) =>
    {
        e.preventDefault();
        postServerWithData(REGISTER,
            {
                email:this.state.email,
                password:this.state.password,
                firstname:this.state.firstname,
                lastname: this.state.lastname
            }).then(res=>{
                this.props.history.push("/login")
            }).catch(err=>{
                console.log(err)
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
                        id="email" onChange={e=>this.handleChange(e)} value={this.state.email}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" 
                        id="password" onChange={e=>this.handleChange(e)} value={this.state.password}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstname">First Name</label>
                        <input autoFocus type="firstname" className="form-control" 
                        id="firstname" onChange={e=>this.handleChange(e)} value={this.state.firstname}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastname">Last Name</label>
                        <input autoFocus type="lastname" className="form-control" 
                        id="lastname" onChange={e=>this.handleChange(e)} value={this.state.lastname}/>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        )
    }
}