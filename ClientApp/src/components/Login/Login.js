import React, { useState } from 'react'
import { Redirect } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import {Form,Row,Button, Jumbotron} from 'react-bootstrap'
import { showSpinner } from "../../Stores/Reducers/spinner";

import { setInfo } from "../../Stores/Reducers/userInfo";

import authenticationService from '../../services/Authentication'

import '../../css/Login.css'


export default function Login() 
{
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [toHome, setToHome] = useState(false)
    const [toRegister, setToRegister] = useState(false)
    const [validated, setValidated] = useState(false)

    const dispatch = useDispatch()

    React.useEffect(() => {
        // after component mounted, it checks if token is valid then redirect to home
        authenticationService.validate().
        then(res => {
            setToHome(true)
        }).catch(err => {
            //console.log(err)
        })
        dispatch(showSpinner(false))
    }, [])

    /*  handleSubmit(e:element)
     *  send user email and password to server
     *  if successful, redirect to home
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        if(!(email.length === 0 || password.length === 0 ))
        {
            dispatch(showSpinner(true))
            authenticationService.login(email, password)
                .then(res => {
                    dispatch(showSpinner(false))
                    dispatch(setInfo(res.id, res.email, res.firstName, res.lastName))
                    setToHome(true)
                }).catch(err => {
                    showToast(err.data.message,'error')
                    dispatch(showSpinner(false))
                })
        }else
        {
            showToast("Email and password required",'error')
        }
        setValidated(true)
    }

    /*  handleRegister()
     *  redirect to register page
     */
    const handleRegister = () => {
        setToRegister(true)
    }

    /*
     * showToast(content:string, type:string)
     * showing toast with string
    */
    const showToast = (content, type) =>{
        switch(type)
        {
            case 'error' :
                toast.error(content,{position:"top-right", 
                autoClose: 3000, hideProgressBar:true, newestOnTop:true,
                closeOnClick: true, pauseOnHover: true, draggable: true})
            break;
            default :
                toast(content,{position:"top-right", 
                autoClose: 3000, hideProgressBar:true, newestOnTop:true,
                closeOnClick: true, pauseOnHover: true, draggable: true})
        }
    }

   if(toRegister === true)
    {
        return <Redirect to='/register'/>
    }
    if(toHome === true)
    {
        return <Redirect to='/home'/>
    }
    return (
        <div className="main">
            <Jumbotron>
                <h3>Doobi-Do!</h3>
            </Jumbotron>
            <Form noValidate onSubmit={(e)=>handleSubmit(e)}>
                <Form.Group controlId="email">
                    <Form.Label>
                        Email
                    </Form.Label>
                    <Form.Control type="email" placeholder="Email" required 
                        pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
                        onChange={e=>setEmail(e.target.value)} value={email} 
                        isValid={(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email)}
                        isInvalid={!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email) && validated}/>
                    <Form.Control.Feedback type="invalid">
                        Email is not valid
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>
                        Password
                    </Form.Label>
                    <Form.Control type="password" placeholder="Password" required
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        onChange={e=>setPassword(e.target.value)} 
                        isValid={(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/).test(password)}
                        isInvalid={!(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/).test(password) && validated}
                    />
                    <Form.Control.Feedback type="invalid">
                        Password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters
                    </Form.Control.Feedback>
                </Form.Group>
                <br/>
                <Form.Group as={Row} controlId="login">
                        <Button type="submit" block>Login</Button>
                </Form.Group>
                <Form.Group as={Row} controlId="register">
                    <Button variant="outline-secondary" type="button" onClick={()=>handleRegister()} className="float-right" block>Register</Button>
                </Form.Group>
            </Form>
        </div>
    )

}