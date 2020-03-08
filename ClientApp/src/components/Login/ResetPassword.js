import React,{useState} from 'react'
import {Form,Row,Button, Jumbotron} from 'react-bootstrap'
import { Redirect } from 'react-router-dom'

import {postServerWithDataAndAuth , RESETPASSWORD} from '../../APIROUTE'
import {showToast} from '../../services/Common'

export default function ResetPassword()
{
    const [userId,setUserId] = useState('')
    const [code,setCode] = useState('')
    const [redirect, setRedirect] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [validated, setValidated] = useState(false)

    React.useEffect(()=>{
        const getQueryStringValue = (key) => {  
            return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
        }  
        setUserId(getQueryStringValue("userId"))
        setCode(getQueryStringValue("code"))
    },[])

    /*  handleSubmit(e:element)
     *  send user email and password to server
     *  if successful, redirect to home
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        if(validate())
        {
            postServerWithDataAndAuth(RESETPASSWORD,{
                id:userId,
                token:code,
                password:password
            })
            .then(res=>{
                showToast("Successfully password changed. Redirect to Doobi-do")
                setRedirect(true)
            })
            .catch(err=>{
                showToast("Error to reset password", 'error')
                console.log(err)
            })
        }
        else
        {
            showToast("Password validation failed", 'error')
        }
        setValidated(true)
    }

    /*  validate()
     *  Validate form before send to server
    */
    const validate = () => {
        var passwordFormat = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
        return passwordFormat.test(password) && password === confirmPassword
    }

    if(redirect)
        return <Redirect to='/login'/>
    return(
        <div className="main">
            <Jumbotron>
                <h3>Doobi-Do!</h3>
            </Jumbotron>
            <Form noValidate onSubmit={(e)=>handleSubmit(e)}>
                <br/>
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
                <Form.Group as={Row} controlId="reset">
                        <Button type="submit" block>Reset Password</Button>
                </Form.Group>
            </Form>
        </div>
    )
}