import React,{useState} from 'react'
import {Form,Row,Button, Jumbotron} from 'react-bootstrap'
import { Redirect } from 'react-router-dom'

import {postServerWithDataAndAuth , CONFIRMEMAIL} from '../../APIROUTE'
import {showToast} from '../../services/Common'

export default function Verification()
{
    const [userId,setUserId] = useState('')
    const [code,setCode] = useState('')
    const [redirect, setRedirect] = useState(false)

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
        postServerWithDataAndAuth(CONFIRMEMAIL,{id:userId,token:code})
        .then(res=>{
            showToast("Successfully confirmed. Redirect to Doobi-do")
            setRedirect(true)
        })
        .catch(err=>{
            showToast("Error to confirm email", 'error')
            console.log(err)
        })
        
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
                <Form.Group as={Row} controlId="login">
                        <Button type="submit" block>Confrim</Button>
                </Form.Group>
            </Form>
        </div>
    )
}