import React, { useState } from 'react'
import TodoModal from './TodoModal'
import { useDispatch, useSelector } from "react-redux";

import {postServerWithDataAndAuth , ADDTODO, DELETETODO, MODIFYTODO } from '../../APIROUTE'
import { setTodos} from "../../Stores/Reducers/categories";
import { showSpinner } from "../../Stores/Reducers/spinner";
import { showToast,validate } from '../../services/Common'

import '../../css/Todo.css'

export default function Todos()
{
    const selectedCategoryindex = useSelector(state=>state.categoryReducer.selectedCategoryIndex)
    const selectedCategoryId = useSelector(state=>state.categoryReducer.selectedCategoryId)
    const todos = useSelector(state=>state.categoryReducer.categories[selectedCategoryindex].todos)
    const showTodos = useSelector(state=>state.headerPanel.index)

    const [modalShow, setModalShow] = useState(false)
    const [selectedTodo, setSelectedTodo] = useState(0)
    const [todoTitle, setTodoTitle] = useState('')

    const dispatch = useDispatch()
    React.useEffect(()=>{
        
    },[])

    /*  addTodo=()
     *  if todo name is not empty, send todo name, and current date, and categoryId to the server
     *  after update db, it updates store with new data and shows toast.
     *  also reset todo text input box
    */
    const addTodo=()=>{
        if(validate(todoTitle))
        {
            dispatch(showSpinner(true))
            postServerWithDataAndAuth(ADDTODO,{
                todoname:todoTitle, 
                tododeadline:new Date(),
                todocompleted:false, 
                newcategoryid:selectedCategoryId
            }).then(res=>{
                dispatch(showSpinner(false))
                dispatch(setTodos(res.data.todos))
                showToast(todoTitle + " Added!")
                setTodoTitle('')
            }).catch(err=>{
                dispatch(showSpinner(false))
                console.log(err)
            })
        }
        else
        {
            showToast("Empty todo cannot be added!",'error')
        }
    }
    
    /*  deleteTodo(index:number)
     *  send corresponding todo ID, name, and its categoryId
     *  shows toast first
     *  then, update store with data
    */
    const deleteTodo = (index) =>{
        dispatch(showSpinner(true))
        postServerWithDataAndAuth(DELETETODO,{
            id : todos[index].id, 
            todoname:todos[index].todoName,
            newcategoryid:selectedCategoryId
        }).then(res=>{
            dispatch(showSpinner(false))
            showToast(todos[index].todoName + " Deleted!")
            dispatch(setTodos(res.data.todos))
        }).catch(err=>{
            dispatch(showSpinner(false))
            console.log(err)
        })
    }

    /*  completeTodo(index:number)
     *  send corresponding todo ID, name, todoDescription, deadline, todocompleted and its categoryId
     *  shows toast first
     *  then, update store with data 
    */
    const completeTodo = (index) =>{
        dispatch(showSpinner(true))
        postServerWithDataAndAuth(MODIFYTODO, {
            id:todos[index].id,
            todoname:todos[index].todoName,
            todoDescription:todos[index].todoDescription,
            tododeadline:todos[index].todoDeadline,
            TodoCompleted:!todos[index].todoCompleted,
            newcategoryid:selectedCategoryId
        }).then(res => {
            dispatch(showSpinner(false))
            var content = todos[index].todoName + (todos[index].todoCompleted ? " Not Completed!" : " Completed!")
            dispatch(setTodos(res.data.todos))
            showToast(content)
        }).catch(err=>{
            console.log(err)
            dispatch(showSpinner(false))
        })
    }

    /*  setModalShow(show:boolean, selected:number, data:{})
     *  depends on show, modal displayed with selected todo data
     *  if data is not undefined which means update needed, update store
    */
    const showModal = (show,selected,data) => {
        if(show)
        { // show modal
            setModalShow(show)
            setSelectedTodo(selected)
        }
        else
        { // close modal
            setModalShow(show)
        }
        // update state from server
        if(data !== undefined)
        {
            dispatch(setTodos(data.data.todos))
        }
    }

    /*  showToast(date:Date)
     *  formating date to 'DDD, MMM dd, yyyy hh:mm aa'
    */
    const dateFormat = (date) =>{
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

    return(
        <div className="card-body">
            <ul className="list-group">
                <div className="input-group" >
                    <input type="text" className="form-control todosTextField" placeholder="Enter a new Todo" id="todoTitle"
                            value={todoTitle} onChange={(e)=>setTodoTitle(e.target.value)}/>
                    <div className="input-group-append" id="addTodo">
                        <button className="btn todoAddBtn" type="button"
                                onClick={()=>addTodo()}>
                            <div className="addImg"></div>
                        </button>
                    </div>
                </div>
            </ul>
            <hr/>
            <ul className="list-group">
                {
                    // todos shouldn't be undefined
                    todos &&
                    todos.map((v,i)=>{
                        if((showTodos === 0 && !v.todoCompleted) || (showTodos === 1 && v.todoCompleted)) // not completed
                        {
                            const delay = new Date(v.todoDeadline) < new Date().setHours(0,0,0,0) && !v.todoCompleted ? "delayed" : ""
                            return (
                            <div className="input-group" key={i}>
                                <div className="input-group-prepend">
                                    <div className={`todoInput input-group-text checkboxWrapper ${delay}`}>
                                        <div id={i} className={`checkboxImg ${v.todoCompleted ? "checked" :""}`} onClick={(e)=>completeTodo(e.target.id)}></div>
                                    </div>
                                </div>
                                <div className="todoInputWrapper">
                                    <div id={i} onDoubleClick={(e)=>showModal(true,e.target.id)} className={`todosTitle ${delay} ${v.todoCompleted ? " completedTodo":""}`}>
                                        {v.todoName}
                                    </div>
                                    <div id={i} className={"todosDate "+delay} onDoubleClick={(e)=>showModal(true,e.target.id)}>
                                        {dateFormat(v.todoDeadline)}
                                    </div>
                                </div>
                                <div className="input-group-append" id="button-addon4">
                                    <button id={i} className="btn todoEditBtn" type="button"
                                        onClick={(e)=>{showModal(true,e.target.id); }}>
                                            <div id={i} className="editImg"></div>
                                    </button>
                                    <button id={i} className="btn todoDeleteBtn" type="button"
                                        onClick={(e)=>deleteTodo(e.target.id)}>
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
                todos &&
                <TodoModal  show={modalShow} 
                            onHide={(data)=>showModal(false,undefined,data)} 
                            todo={todos[selectedTodo]}
                            />
            }
        </div>
    )

}