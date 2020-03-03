import React from 'react'
import TodoModal from './TodoModal'
import { toast } from 'react-toastify';
import { connect } from "react-redux";

import {postServerWithDataAndAuth , ADDTODO, GETTODO, DELETETODO, MODIFYTODO } from '../../APIROUTE'
import {store} from '../../store'
import { setTodos} from "../../Stores/Reducers/categories";

import '../../css/Todo.css'

class Todos extends React.PureComponent
{
    constructor(props) {
        super(props);
        this.state = {
            todoTitle:"",
            modalShow : false,
            selectedTodo:0,
            data :[],
            needUpdate : 0,
            showTodos : store.getState().headerPanel.index
        }
        this.unsubscribe = store.subscribe(()=>{
            const data = store.getState().categoryReducer.categories[this.props.categoryIndex] ? store.getState().categoryReducer.categories[this.props.categoryIndex].todos : []
            this.setState({
                data:data,
                showTodos:store.getState().headerPanel.index
            })
        })
    }

    componentDidMount()
    {
        this.setState({data:this.props.category.todos})
    }

    componentWillUnmount()
    {
        this.unsubscribe()
    }

    componentDidUpdate(prevProps)
    {
        if(this.props.category && prevProps.category.todos !== this.props.category.todos)
        { // update if category changed
            this.setState({data:this.props.category.todos})
        }
    }

    addTodo=()=>{
        if(this.state.todoTitle.length !== 0)
        {
            postServerWithDataAndAuth(ADDTODO,{
                todoname:this.state.todoTitle, 
                tododeadline:new Date(),
                todocompleted:false, 
                newcategoryid:this.props.category.id
            }).then(res=>{
                this.props.setTodos(res.data.todos,this.props.category.id)
                this.showToast(this.state.todoTitle + " Added!")
                this.setState({todoTitle:""})
            }).catch(err=>{
                console.log(err)
            })
        }
        else
        {
            this.showToast("Empty todo cannot be added!")
        }
    }

    deleteTodo = (index) =>{
        postServerWithDataAndAuth(DELETETODO,{
            id : this.state.data[index].id, 
            todoname:this.state.data[index].todoName,
            newcategoryid:this.props.category.id
        }).then(res=>{
            this.props.setTodos(res.data.todos,this.props.category.id)
            this.showToast(this.state.data[index].todoName + " Deleted!")
        }).catch(err=>{
            console.log(err)
        })
    }

    completeTodo = (index) =>{
        postServerWithDataAndAuth(MODIFYTODO, {
            id:this.state.data[index].id,
            todoname:this.state.data[index].todoName,
            todoDescription:this.state.data[index].todoDescription,
            tododeadline:this.state.data[index].todoDeadline,
            TodoCompleted:!this.state.data[index].todoCompleted,
            newcategoryid:this.props.category.id
        }).then(res => {
            this.props.setTodos(res.data.todos,this.props.category.id)
            var content = this.state.data[index].todoName + (!this.state.data[index].todoCompleted ? " Not Completed!" : " Completed!")
            this.showToast(content)
            
            this.setState({data:res.data.todos,todoTitle:""})
            //this.getTodoFromServer()
        })
    }

    setModalShow = (show,selected,data) => {
        if(show)
        { // show modal
            this.setState({
                modalShow : show, 
                selectedTodo: selected
            })
            
        }
        else
        { // close modal
            this.setState({
                modalShow : show
            })
        }
        // update state from server
        if(data !== undefined)
        {
            this.props.setTodos(data.data.todos,this.props.category.id)
        }
    }

    handleChange = (e) =>
    {
        this.setState({
            [e.target.id]:e.target.value
        })
    }

    showToast = (content) =>{
        toast(content,{position:"top-right", 
                            autoClose: 3000, hideProgressBar:true, newestOnTop:true,
                            closeOnClick: true, pauseOnHover: true, draggable: true})
    }

    render()
    {
        return(
            <div className="card-body">
                <ul className="list-group">
                    <div className="input-group" >
                        <input type="text" className="form-control" placeholder="Enter a new Todo" id="todoTitle"
                                value={this.state.todoTitle} onChange={(e)=>this.handleChange(e)}/>
                        <div className="input-group-append" id="addTodo">
                            <button className="btn btn-outline-primary" type="button" 
                            onClick={()=>this.addTodo()}>Add</button>
                        </div>
                    </div>
                </ul>
                <hr/>
                <ul className="list-group">
                    {
                        this.state.data && this.state.data &&
                        this.state.data.map((v,i)=>{
                            if((this.state.showTodos === 0 && !v.todoCompleted) || (this.state.showTodos === 1 && v.todoCompleted)) // not completed
                            {
                                return (
                                <div className="input-group" key={i}>
                                    <div className="input-group-prepend">
                                        <div className="input-group-text">
                                        <input id={i} type="checkbox" checked={v.todoCompleted}
                                            onChange={(e)=>this.completeTodo(e.target.id)}/>
                                        </div>
                                    </div>
                                    <input type="text" id={i} 
                                    className={`todoInput form-control ${v.todoCompleted ? "completedTodo" : ""} ${new Date(v.todoDeadline) < new Date().setHours(0,0,0,0) && !v.todoCompleted ? "delayed" : ""}`} 
                                    value={v.todoName} readOnly onDoubleClick={(e)=>this.setModalShow(true,e.target.id)}
                                    />
                                    <div className="input-group-append" id="button-addon4">
                                        <button id={i} className="btn btn-outline-info" type="button"
                                        onClick={(e)=>this.setModalShow(true,e.target.id)}>Edit</button>
                                        <button id={i} className="btn btn-outline-danger" type="button"
                                        onClick={(e)=>this.deleteTodo(e.target.id)}>Delete</button>
                                    </div>
                                </div>
                                )
                            }
                            else
                                return null;
                        })
                    }
                </ul>
                <TodoModal  show={this.state.modalShow} 
                            onHide={(data)=>this.setModalShow(false,undefined,data)} 
                            todo={this.state.data[this.state.selectedTodo]}
                            />
            </div>
        )
    }
}

export default connect(
    null,
    {setTodos}
)(Todos)

/*
*/