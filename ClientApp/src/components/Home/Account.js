import React,{useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {Alert,Button, InputGroup, FormControl, Form} from 'react-bootstrap'
import { Redirect } from 'react-router-dom';

import {postServerWithDataAndAuth , UPDATEUSER, DELETEUSER, VERIFYPASSWORD} from '../../APIROUTE'
import {showToast} from '../../services/Common'
import { setInfo } from '../../Stores/Reducers/userInfo';
import { showSpinner } from "../../Stores/Reducers/spinner";
import authenticationService from '../../services/Authentication'
import { persistor} from '../../store'



export default function Account()
{
    const info = useSelector(state=>state.userInfo)
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [showAlert, setShowAlert] = useState(false)
    const [toLogin, setToLogin] = useState(false)
    const [password, setPassword] = useState('')
    const [verified, setVerified] = useState(false)

    const dispatch = useDispatch()

    React.useEffect(()=>{
        setFirstname(info.firstName)
        setLastname(info.lastName)
    },[])

    const updateUser = () =>{
        dispatch(showSpinner(true))
        postServerWithDataAndAuth(UPDATEUSER,{
            id:info.id,
            email:info.email,
            firstname : firstname,
            lastname:lastname
        })
        .then(res=>{
            showToast("User information has been updated")
            dispatch(setInfo(res.data.id, res.data.email, res.data.firstName, res.data.lastName))
            dispatch(showSpinner(false))
        })
        .catch(err=>{
            showToast("Error occured while updating user information",'error')
            dispatch(showSpinner(false))
        })
    }

    const deleteAccount = () =>{
        dispatch(showSpinner(true))
        postServerWithDataAndAuth(DELETEUSER,{
            id:info.id,
            email:info.email,
            password:password
        })
        .then(res=>{
            showToast("User "+res.data.email+" has been Deleted")
            dispatch(showSpinner(false))
            authenticationService.logout()
            persistor.purge()
            setToLogin(true)
        })
        .catch(err=>{
            showToast("Error occured while updating user information",'error')
            dispatch(showSpinner(false))
        })
    }

    const checkPassword = () =>{
        dispatch(showSpinner(true))
        postServerWithDataAndAuth(VERIFYPASSWORD,{
            id:info.id,
            email:info.email,
            password:password
        })
        .then(res=>{
            dispatch(showSpinner(false))
            setVerified(true)
        })
        .catch(err=>{
            showToast("Error occured while verifying password",'error')
            dispatch(showSpinner(false))
            setVerified(false)
        })
    }

    if(toLogin === true)
    {
        return <Redirect to="/login"/>
    }
    return (
        <div className="settingBody">
            <h2>Change User name</h2>
            <hr/>
            <InputGroup className="mb-3">
                <FormControl
                placeholder="First name" onChange={(e)=>setFirstname(e.target.value)} value={firstname}
                />
                <InputGroup.Append>
                    <Button variant="outline-primary" onClick={()=>updateUser()}>Change</Button>
                </InputGroup.Append>
            </InputGroup>
            <InputGroup className="mb-3">
                <FormControl
                placeholder="Last name" onChange={(e)=>setLastname(e.target.value)} value={lastname}
                />
                <InputGroup.Append>
                    <Button variant="outline-primary" onClick={()=>updateUser()}>Change</Button>
                </InputGroup.Append>
            </InputGroup>
            <br/>
            <h2>Delete Account</h2>
            <hr/>
            <InputGroup>
                <Button className="float-right" variant="outline-danger"
                onClick={()=>{setShowAlert(true)}}>Delete your account</Button>
            </InputGroup>
            <br/>
            <Alert show={showAlert} variant="danger">
                <Alert.Heading>This action is undoable.</Alert.Heading>
                <p>
                    Once you delete your account, there is no going back. Please be certain.      
                </p>
                <InputGroup className="mb-3">
                    <FormControl type="password"
                        placeholder="Password" onChange={(e)=>setPassword(e.target.value)} isValid={verified} isInvalid={!verified}/>
                    <InputGroup.Append>
                        <Button variant="outline-primary" onClick={()=>checkPassword()}>Confirm</Button>
                    </InputGroup.Append>
                </InputGroup>
                <hr />
                <div className="d-flex justify-content-between">
                    <Button onClick={()=>deleteAccount()} variant="outline-danger" disabled={!verified}>
                        Delete Anyway
                    </Button>
                    <Button onClick={() => setShowAlert(false)} variant="outline-primary">
                        Cancel
                    </Button>
                </div>
            </Alert>
        </div>
    )
}