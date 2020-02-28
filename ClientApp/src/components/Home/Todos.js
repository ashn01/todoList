import React from 'react'


import {postServerWithDataAndAuth , ADDTODO, GETTODO } from '../../APIROUTE'
import '../../css/Todo.css'

export default class Todos extends React.PureComponent
{
    constructor(props) {
        super(props);
        this.state = {
            todoTitle:"",
            data :[]
        }
    }

    componentDidMount()
    {
        if(this.props.category)
        {
            this.getTodoFromServer()
        }
    }

    componentDidUpdate(prevProps)
    {
        if(this.props.category && prevProps.category !== this.props.category)
        { // update if category changed
            this.getTodoFromServer()
        }
    }
    
    getTodoFromServer()
    {
        postServerWithDataAndAuth(GETTODO,{
            id:this.props.category.id
        }).then(res=>{
            this.setState({data:res.data.todos})
        })
    }

    addTodo=()=>{
        postServerWithDataAndAuth(ADDTODO,{
            todoname:this.state.todoTitle, 
            todocompleted:false, 
            categoryid:this.props.category.id
        }).then(res=>{
            this.getTodoFromServer()
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
        return(
            <div className="card-body">
                <ul className="list-group">
                    <div className="input-group" >
                        <input type="text" className="form-control" placeholder="Enter a new Todo" id="todoTitle"
                                onChange={(e)=>this.handleChange(e)}/>
                        <div className="input-group-append" id="addTodo">
                            <button className="btn btn-outline-primary" type="button" 
                            onClick={()=>this.addTodo()}>Add</button>
                        </div>
                    </div>
                </ul>
                <hr/>
                <ul className="list-group">
                    {
                        this.state.data.map((v,i)=>{
                            return (
                                <div className="input-group" key={i}>
                                    <div className="input-group-prepend">
                                        <div className="input-group-text">
                                        <input type="checkbox" aria-label="Checkbox for following text input"/>
                                        </div>
                                    </div>
                                    <input type="text" className="todoInput form-control" value={v.todoName} readOnly/>
                                    <div className="input-group-append" id="button-addon4">
                                        <button className="btn btn-outline-info" type="button">Edit</button>
                                        <button className="btn btn-outline-danger" type="button">Remove</button>
                                    </div>
                                </div>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}