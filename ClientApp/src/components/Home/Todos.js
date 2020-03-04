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
            showTodos : store.getState().headerPanel.index,
            selectedCategoryIndex : store.getState().categoryReducer.selectedCategoryIndex,
            selectedCategoryId : store.getState().categoryReducer.selectedCategoryId,
            todos : []
        }
        this._isMounted = false;
        this.unsubscribe = store.subscribe(()=>{
            const selectedCategoryIndex = store.getState().categoryReducer.selectedCategoryIndex
            const data = store.getState().categoryReducer.categories[selectedCategoryIndex] ? 
                    store.getState().categoryReducer.categories[selectedCategoryIndex].todos : []
            
            if(this._isMounted)
            {
                this.setState({
                    todos:data ,
                    showTodos:store.getState().headerPanel.index,
                    selectedCategoryIndex: selectedCategoryIndex,
                    selectedCategoryId:store.getState().categoryReducer.selectedCategoryId
                })
            }
        })
    }

    componentDidMount()
    {
        this._isMounted = true;
        const data = store.getState().categoryReducer.categories[this.state.selectedCategoryIndex].todos
        this.setState({todos:data})
    }

    componentWillUnmount()
    {
        this._isMounted = false;
        this.unsubscribe()
    }

    addTodo=()=>{
        if(this.state.todoTitle.length !== 0)
        {
            postServerWithDataAndAuth(ADDTODO,{
                todoname:this.state.todoTitle, 
                tododeadline:new Date(),
                todocompleted:false, 
                newcategoryid:this.state.selectedCategoryId
            }).then(res=>{
                this.props.setTodos(res.data.todos)
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
            id : this.state.todos[index].id, 
            todoname:this.state.todos[index].todoName,
            newcategoryid:this.state.selectedCategoryId
        }).then(res=>{
            this.props.setTodos(res.data.todos)
            this.showToast(this.state.category.todos[index].todoName + " Deleted!")
        }).catch(err=>{
            console.log(err)
        })
    }

    completeTodo = (index) =>{
        postServerWithDataAndAuth(MODIFYTODO, {
            id:this.state.todos[index].id,
            todoname:this.state.todos[index].todoName,
            todoDescription:this.state.todos[index].todoDescription,
            tododeadline:this.state.todos[index].todoDeadline,
            TodoCompleted:!this.state.todos[index].todoCompleted,
            newcategoryid:this.state.selectedCategoryId
        }).then(res => {
            var content = this.state.todos[index].todoName + (!this.state.todos[index].todoCompleted ? " Not Completed!" : " Completed!")
            this.props.setTodos(res.data.todos)
            this.showToast(content)
            this.setState({todos:res.data.todos})
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
            this.props.setTodos(data.data.todos)
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
                        <input type="text" className="form-control todosTextField" placeholder="Enter a new Todo" id="todoTitle"
                                value={this.state.todoTitle} onChange={(e)=>this.handleChange(e)}/>
                        <div className="input-group-append" id="addTodo">
                            <button className="btn todoAddBtn" type="button"
                                    onClick={()=>this.addTodo()}>
                                <div className="addImg"></div>
                            </button>
                        </div>
                    </div>
                </ul>
                <hr/>
                <ul className="list-group">
                    {
                        this.state.todos &&
                        this.state.todos.map((v,i)=>{
                            if((this.state.showTodos === 0 && !v.todoCompleted) || (this.state.showTodos === 1 && v.todoCompleted)) // not completed
                            {
                                return (
                                <div className="input-group" key={i}>
                                    <div className="input-group-prepend">
                                        <div className={`todoInput input-group-text checkboxWrapper ${new Date(v.todoDeadline) < new Date().setHours(0,0,0,0) && !v.todoCompleted ? "delayed" : ""}`}>
                                            <div id={i} className={`checkboxImg ${v.todoCompleted ? "checked" :""}`} onClick={(e)=>this.completeTodo(e.target.id)}></div>
                                        </div>
                                    </div>
                                    <input type="text" id={i} 
                                    className={`todoInput form-control todosTextField ${v.todoCompleted ? "completedTodo" : ""} ${new Date(v.todoDeadline) < new Date().setHours(0,0,0,0) && !v.todoCompleted ? "delayed" : ""}`} 
                                    value={v.todoName} readOnly onDoubleClick={(e)=>this.setModalShow(true,e.target.id)}
                                    />
                                    <div className="input-group-append" id="button-addon4">
                                        <button id={i} className="btn todoEditBtn" type="button"
                                            onClick={(e)=>this.setModalShow(true,e.target.id)}>
                                                <div className="editImg"></div>
                                        </button>
                                        <button id={i} className="btn todoDeleteBtn" type="button"
                                            onClick={(e)=>this.deleteTodo(e.target.id)}>
                                                <div className="deleteImg"></div>
                                        </button>
                                    </div>
                                </div>
                                )
                            }
                            else
                                return null;
                        })
                    }
                </ul>
                {
                    this.state.todos &&
                    <TodoModal  show={this.state.modalShow} 
                                onHide={(data)=>this.setModalShow(false,undefined,data)} 
                                todo={this.state.todos[this.state.selectedTodo]}
                                />
                }
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