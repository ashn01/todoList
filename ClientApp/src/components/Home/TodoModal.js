import React, {useState} from 'react'
import {Modal, Button, InputGroup, FormControl} from 'react-bootstrap'
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker'

import {postServerWithDataAndAuth, MODIFYTODO, DELETETODO} from '../../APIROUTE'

import "react-datepicker/dist/react-datepicker.css";

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
                                                        props.todo.CategoryId 
                                                    :   "");                                                             
    React.useEffect(()=>{
        if(props.todo !== undefined)
        {
            setTodoName(props.todo.todoName);
            setTodoId(props.todo.id);
            setTodoDeadline(new Date(props.todo.todoDeadline));
            setTodoDescription(props.todo.todoDescription);
            setTodoCompleted(props.todo.todoCompleted);
            setCategoryId(props.todo.categoryId);
        }
        else
        {
            setTodoName("");
            setTodoId(-1);
        }
    }, [props.todo, props.show])

    
    const modifyTodo = () =>{
        if(todoName.length !== 0)
        {
            postServerWithDataAndAuth(MODIFYTODO, {
                id:todoId,
                todoname:todoName,
                todoDescription:todoDescription,
                tododeadline:todoDeadline,
                TodoCompleted:todoCompleted,
                categoryid:todoCategoryId
            }).then(res => {
                showToast(props.todo.todoName + " Edited!")
                props.onHide(true) // true to update
            })
        }else
        {
            showToast("Todo name cannot be empty!")
        }

    }
    
    const deleteTodo = () => {
        postServerWithDataAndAuth(DELETETODO, {
        }).then(res => {
            props.onHide(true) // true to update
        })
    }

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
                    <InputGroup.Text className="todoModalText">Todo Name</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                placeholder="Category name"
                value = {todoName}
                onChange={(e)=>setTodoName(e.target.value)}
                required
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Prepend className="todoModalPrepand">
                    <InputGroup.Text className="todoModalText">Description</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl 
                as="textarea" 
                value = {todoDescription ? todoDescription : ""}
                onChange={(e)=>setTodoDescription(e.target.value)}
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Prepend className="todoModalPrepand">
                    <InputGroup.Text className="todoModalText">Deadline</InputGroup.Text>
                </InputGroup.Prepend>
                    <DatePicker className="form-control todoModalText" selected={todoDeadline} onChange={date => setTodoDeadline(date)}
                                dateFormat="MM-dd-yyyy hh:mm aa" showTimeInput timeInputLabel="Time:" showYearDropdown/>
                <InputGroup.Prepend>
                <Button onClick={()=>setTodoDeadline(new Date())}>Today</Button>
                    <InputGroup.Checkbox checked={todoCompleted} onChange={(e)=>setTodoCompleted(e.target.checked)}/>
                    <InputGroup.Text>Completed</InputGroup.Text>
                </InputGroup.Prepend>
            </InputGroup>
        </Modal.Body>
        <Modal.Footer>
            {
                //props.category !== undefined && 
                //<Button variant="danger" onClick={() => setShowAlert(true)}>Delete</Button>
            }
            {
                props.todo !== undefined &&
                    <Button onClick={modifyTodo}>Edit</Button>
            }
            <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }