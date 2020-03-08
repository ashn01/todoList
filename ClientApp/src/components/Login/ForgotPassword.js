import React, { useState } from 'react'
import { useDispatch } from "react-redux";
import {Form,Row,Button, Jumbotron} from 'react-bootstrap'
import { Redirect } from 'react-router-dom';

import { showSpinner } from "../../Stores/Reducers/spinner";
import {postServerWithDataAndAuth , FORGOTPASSWORD} from '../../APIROUTE'


import {showToast} from '../../services/Common'

import '../../css/Login.css'


export default function ForgotPassword() 
{
    const [email, setEmail] = useState('')
    const [toLogin, setToLogin] = useState(false)
    const [validated, setValidated] = useState(false)

    const dispatch = useDispatch()

    React.useEffect(() => {

    }, [])

    /*  handleSubmit(e:element)
     *  send user email to server
     *  if successful, redirect to login and user will get resetPassword link
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        if(email.length !== 0 )
        {
            dispatch(showSpinner(true))
            postServerWithDataAndAuth(FORGOTPASSWORD, {email:email})
            .then(res=>{
                console.log(res)
                dispatch(showSpinner(false))
                showToast("Confirm email sent to "+email)
                setToLogin(true)
            })
            .catch(err=>{
                console.log(err.response)
                showToast(err.response.data.message,'error')
                dispatch(showSpinner(false))
            })
            
        }else
        {
            showToast("Email required",'error')
        }
        setValidated(true)
    }
    if(toLogin === true)
    {   
        return <Redirect to="/login"/>
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
                <br/>
                <Form.Group as={Row} controlId="send">
                        <Button type="submit" block>Send email</Button>
                </Form.Group>
                <Form.Group as={Row} controlId="cancel">
                        <Button type="button" block onClick={()=>setToLogin(true)}>Cancel</Button>
                </Form.Group>
            </Form>
        </div>
    )

}