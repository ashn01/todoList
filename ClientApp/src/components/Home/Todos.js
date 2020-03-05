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
            this.setDataFromStore();
        })
    }

    /*  setDataFromStore()
     *  get Data from store and set it to its state
     *  it checks if this component is mounted, otherwise will not set data
    */
    setDataFromStore()
    {
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
    }

    componentDidMount()
    {
        this._isMounted = true;
        this.setDataFromStore()
    }

    componentWillUnmount()
    {
        this._isMounted = false;
        this.unsubscribe()
    }

    
    /*  addTodo=()
     *  if todo name is not empty, send todo name, and current date, and categoryId to the server
     *  after update db, it updates store with new data and shows toast.
     *  also reset todo text input box
    */
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

    /*  deleteTodo(index:number)
     *  send corresponding todo ID, name, and its categoryId
     *  shows toast first
     *  then, update store with data
    */
    deleteTodo = (index) =>{
        postServerWithDataAndAuth(DELETETODO,{
            id : this.state.todos[index].id, 
            todoname:this.state.todos[index].todoName,
            newcategoryid:this.state.selectedCategoryId
        }).then(res=>{
            this.showToast(this.state.todos[index].todoName + " Deleted!")
            this.props.setTodos(res.data.todos)
        }).catch(err=>{
            console.log(err)
        })
    }

    /*  completeTodo(index:number)
     *  send corresponding todo ID, name, todoDescription, deadline, todocompleted and its categoryId
     *  shows toast first
     *  then, update store with data 
    */
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
        })
    }

    /*  setModalShow(show:boolean, selected:number, data:{})
     *  depends on show, modal displayed with selected todo data
     *  if data is not undefined which means update needed, update store
    */
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

    /*  handleChange(e:element)
     *  change state with corresponding data when element onChange fired
    */
    handleChange = (e) =>
    {
        this.setState({
            [e.target.id]:e.target.value
        })
    }

    /*  showToast(content:string)
     *  display toast with string
    */
    showToast = (content) =>{
        toast(content,{position:"top-right", 
                            autoClose: 3000, hideProgressBar:true, newestOnTop:true,
                            closeOnClick: true, pauseOnHover: true, draggable: true})
    }

    /*  showToast(date:Date)
     *  formating date to 'DDD, MMM dd, yyyy hh:mm aa'
    */
    dateFormat = (date) =>{
        var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

        var d = new Date(date)
        var doW = days[d.getDay()]
        var mon = months[d.getMonth()]
        var day = (d.getDay()+1)
        var year = d.getFullYear()
        var hour = d.getHours() % 12 ? d.getHours() % 12 : 12
        var min = d.getMinutes()
        hour = hour < 10 ? "0"+hour : hour
        min = min < 10 ? "0"+min : min
        var ampm = d.getHours() >= 12 ? 'pm' : 'am'
        return doW+", "+mon+" "+day+", "+year+"  "+hour+":"+min+" "+ampm
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
                        // todos shouldn't be undefined
                        this.state.todos &&
                        this.state.todos.map((v,i)=>{
                            if((this.state.showTodos === 0 && !v.todoCompleted) || (this.state.showTodos === 1 && v.todoCompleted)) // not completed
                            {
                                const delay = new Date(v.todoDeadline) < new Date().setHours(0,0,0,0) && !v.todoCompleted ? "delayed" : ""
                                return (
                                <div className="input-group" key={i}>
                                    <div className="input-group-prepend">
                                        <div className={`todoInput input-group-text checkboxWrapper ${delay}`}>
                                            <div id={i} className={`checkboxImg ${v.todoCompleted ? "checked" :""}`} onClick={(e)=>this.completeTodo(e.target.id)}></div>
                                        </div>
                                    </div>
                                    <div className="todoInputWrapper">
                                        <div id={i} onDoubleClick={(e)=>this.setModalShow(true,e.target.id)} className={`todosTitle ${delay} ${v.todoCompleted ? " completedTodo":""}`}>
                                            {v.todoName}
                                        </div>
                                        <div id={i} className={"todosDate "+delay} onDoubleClick={(e)=>this.setModalShow(true,e.target.id)}>
                                            {this.dateFormat(v.todoDeadline)}
                                        </div>
                                    </div>
                                    <div className="input-group-append" id="button-addon4">
                                        <button id={i} className="btn todoEditBtn" type="button"
                                            onClick={(e)=>{this.setModalShow(true,e.target.id); }}>
                                                <div id={i} className="editImg"></div>
                                        </button>
                                        <button id={i} className="btn todoDeleteBtn" type="button"
                                            onClick={(e)=>this.deleteTodo(e.target.id)}>
                                                <div id={i} className="deleteImg"></div>
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
                        // todos shouldn't be undefined
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