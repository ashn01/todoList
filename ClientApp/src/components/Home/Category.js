import React from 'react'
import $ from 'jquery'

import Todos from './Todos'

import '../../css/Category.css'

export default class Category extends React.PureComponent
{
    constructor(props) {
        super(props);
        this.state = {
            category : [
                {title : "My Category"},
                {title : "My Category2"},
                {title : "My Category3"}
            ]
        }
    }

    componentDidMount()
    {
        $('.nav li').click((e)=>{
            $('.nav li div.active').removeClass('active');
            $(e.target).addClass('active');
        })
    }

    render()
    {
        return(
        <div className="card text-center">
            <div className="card-header">
            <ul className="nav nav-tabs card-header-tabs">
                {
                    this.state.category.map((v,i)=>{
                        return (
                            <li className={`nav-item `} key={i} >
                                <div className={`category nav-link ${i===0 ? "active" : ""}`} >{v.title}</div>
                            </li>
                        )
                    })
                }
                <li className="nav-item">
                    <div className="category nav-link" >+</div>
                </li>
            </ul>
            </div>
            <div className="card-body">
                <ul className="list-group">
                    <div className="input-group" >
                        <input type="text" className="form-control" placeholder="Enter a new Todo"
                        aria-label="Recipient's username with two button addons" 
                        aria-describedby="button-addon4" />
                        <div className="input-group-append" id="addTodo">
                            <button className="btn btn-outline-primary" type="button">Add</button>
                        </div>
                    </div>
                </ul>
                <hr/>
                <Todos/>
            </div>
        </div>
        )
    }
}