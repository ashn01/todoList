import React, {useState} from 'react'
import {Modal, Button, InputGroup, FormControl} from 'react-bootstrap'
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker'
import $ from 'jquery'
import { useSelector, useDispatch } from "react-redux";

import {postServerWithDataAndAuth, MODIFYTODO, DELETETODO} from '../../APIROUTE'

import "react-datepicker/dist/react-datepicker.css";
import '../../css/Todo.css'

export default function TodoModal(props) {
    const [todoId, setTodoId] = useState(props.todo !== undefined ? 
                                                    props.todo.id 
                                                :   -1);         
    const [todoName, setTodoName] = useState(props.todo !== undefined ? 
                                                        props.todo.todoName 
                                                    :   ""); 
    const [todoDescription, setTodoDescription] = useState(props.todo !== undefined ? 
                                                        props.todo.todoDescription 
                                                    :   "");
    const [todoDeadline, setTodoDeadline] = useState(props.todo !== undefined ? 
                                                        new Date(props.todo.todoDeadline)
                                                    :   new Date());   
    const [todoCompleted, setTodoCompleted] = useState(props.todo !== undefined ? 
                                                        props.todo.todoCompleted 
                                                    :   "");     
    const [todoCategoryId, setCategoryId] = useState(props.todo !== undefined ? 
                                                        props.todo.newCategoryId 
                                                    :   "");  
    const store = useSelector(state => state); // get redux store
    const dispatch = useDispatch()
    
    $('.react-datepicker-wrapper').addClass('form-control'); // add class to datepicker                                    
    React.useEffect(()=>{
        if(props.todo !== undefined)
        {
            setTodoName(props.todo.todoName);
            setTodoId(props.todo.id);
            setTodoDeadline(new Date(props.todo.todoDeadline));
            setTodoDescription(props.todo.todoDescription);
            setTodoCompleted(props.todo.todoCompleted);
            setCategoryId(props.todo.newCategoryId);
        }
        else
        {
            setTodoName("");
            setTodoId(-1);
        }
    }, [props.todo, props.show])

    /*  modifyTodo()
     *  send modified data to server and showing toast
     *  then, close modal
    */
    const modifyTodo = () =>{
        if(todoName.length !== 0)
        {
            postServerWithDataAndAuth(MODIFYTODO, {
                id:todoId,
                todoname:todoName,
                todoDescription:todoDescription,
                tododeadline:todoDeadline,
                TodoCompleted:todoCompleted,
                newcategoryid:todoCategoryId
            }).then(res => {
                showToast(props.todo.todoName + " Edited!")
                props.onHide(res) // true to update
            })
        }else
        {
            showToast("Todo name cannot be empty!")
        }

    }
    
    /*  deleteTodo()
     *  Not implemented
    */
    const deleteTodo = () => {
        // postServerWithDataAndAuth(DELETETODO, {
        // }).then(res => {
        //     props.onHide(true) // true to update
        // })
    }

    /*  showToast(content:string)
     *  Displaying toast with string
    */
    const showToast = (content) =>{
        toast(content,{position:"top-right", 
                            autoClose: 3000, hideProgressBar:true, newestOnTop:true,
                            closeOnClick: true, pauseOnHover: true, draggable: true})
    }

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
              {
                  props.todo !== undefined ? "Modify "+props.todo.todoName : "Add Todo"
              }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <InputGroup className="mb-3">
                <InputGroup.Prepend className="todoModalPrepand">
                    <InputGroup.Text className="todoModalText justify-content-center">Todo Name</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                className="todoTextArea"
                placeholder="Category name"
                value = {todoName}
                onChange={(e)=>setTodoName(e.target.value)}
                required
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Prepend className="todoModalPrepand">
                    <InputGroup.Text className="todoModalText justify-content-center">Description</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl 
                as="textarea" 
                value = {todoDescription ? todoDescription : ""}
                onChange={(e)=>setTodoDescription(e.target.value)}
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Prepend className="todoModalPrepand">
                    <InputGroup.Text className="todoModalText justify-content-center">Deadline</InputGroup.Text>
                </InputGroup.Prepend>
                    <DatePicker className="datePicker todoModalText" selected={todoDeadline} onChange={date => setTodoDeadline(date)}
                                dateFormat="EEE, MMM dd, yyyy  hh:mm a" showTimeInput timeInputLabel="Time:" showYearDropdown/>
                
                <InputGroup.Append>
                    <Button variant="outline-secondary" onClick={()=>setTodoDeadline(new Date())}>Today</Button>
                </InputGroup.Append>
            </InputGroup>
        </Modal.Body>
        <Modal.Footer>
            {   // delete is not implemented
                //props.category !== undefined && 
                //<Button variant="danger" onClick={() => setShowAlert(true)}>Delete</Button>
            }
            {   // valid check
                props.todo !== undefined &&
                    <Button variant="info" onClick={modifyTodo}>Edit</Button>
            }
            <Button variant="outline-info" onClick={()=>props.onHide(undefined)}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }