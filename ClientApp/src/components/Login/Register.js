import React, { useState } from 'react'
import { Redirect } from 'react-router-dom';
import {Form,Button, Jumbotron} from 'react-bootstrap'
import { useDispatch } from 'react-redux';

import { showSpinner } from "../../Stores/Reducers/spinner";
import {postServerWithData , REGISTER} from '../../APIROUTE'
import {showToast} from '../../services/Common'

export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [toLogin, setToLogin] = useState(false)
    const [validated, setValidated] = useState(false)
    const dispatch = useDispatch()

    /*  handleSubmit(e:element)
     *  send user info to server
     *  if successful, redirect to login page
    */
    const handleSubmit = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (validate()) {
            dispatch(showSpinner(true))
            postServerWithData(REGISTER, {
                email: email,
                password: password,
                firstname: firstname,
                lastname: lastname
            }).then(res => {
                showToast("Confirm email sent to "+email)
                dispatch(showSpinner(false))
                handleLogin()
            }).catch(err => {
                dispatch(showSpinner(false))
                showToast(err.response.data.message,'error')
            })
        }
        else
        {
            showToast("All information is required",'error')
        }
        setValidated(true)
    }

    /*  validate()
     *  Validate form before send to server
    */
    const validate = () => {
        var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var passwordFormat = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
        return mailFormat.test(email) && passwordFormat.test(password) && password === confirmPassword && firstname.length > 0 && lastname.length > 0
    }

    /*  handleLogin()
     *  redirect to login page
     */
    const handleLogin = () => {
        setToLogin(true)
    }

    if(toLogin === true)
    {
        return <Redirect to='/login'/>
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
                <Form.Group controlId="confirmPassword">
                    <Form.Label >
                        Confirm Password
                    </Form.Label>
                        <Form.Control type="password" placeholder="Confirm Password" required
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        onChange={e=>setConfirmPassword(e.target.value)}
                        isValid={password === confirmPassword && confirmPassword.length > 0 && (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/).test(password)}
                        isInvalid={(password !==confirmPassword || confirmPassword.length === 0 || !(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/).test(password)) && validated}
                    />
                    <Form.Control.Feedback type="invalid">
                        {
                            password !== confirmPassword ? "Password does not match"
                            : "Password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                        }
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="firstname">
                    <Form.Label>
                        First Name
                    </Form.Label>
                    <Form.Control type="text" placeholder="FirstName"
                        onChange={e=>{e.target.validity.valid ? 
                                setFirstname(e.target.value) 
                                : setFirstname(firstname)}} value={firstname} 
                        isValid={firstname.length > 0}
                        pattern="[a-zA-Z]*"
                        isInvalid={firstname.length === 0 && validated}/>
                    <Form.Control.Feedback type="invalid">
                        Invalid First Name
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="lastname">
                    <Form.Label>
                        Last Name
                    </Form.Label>
                    <Form.Control type="text" placeholder="LastName"
                        onChange={e=>{e.target.validity.valid ? 
                                setLastname(e.target.value) 
                                : setLastname(lastname)}} value={lastname} 
                        isValid={lastname.length > 0}
                        pattern="[a-zA-Z]*"
                        isInvalid={lastname.length === 0 && validated}/>
                    <Form.Control.Feedback type="invalid">
                        Invalid Last Name
                    </Form.Control.Feedback>
                </Form.Group>
                <br/>
                
                <Form.Group controlId="buttons">
                    <Button type="button" variant="outline-secondary" onClick={()=>handleLogin()}>Cancel</Button>
                    <Button type="submit" className="float-right">Submit</Button>
                </Form.Group>
            </Form>
        </div>
    )
}