import React,{useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {Form,Button} from 'react-bootstrap'

import { setHeader } from "../../Stores/Reducers/headerPanel";
import {showToast} from '../../services/Common'
import {postServerWithDataAndAuth , UPDATEUSER} from '../../APIROUTE'
import { showSpinner } from "../../Stores/Reducers/spinner";



export default function ChangePassword()
{
    const info = useSelector(state=>state.userInfo)
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [curPassword, setCurPassword] = useState('')
    const [validated, setValidated] = useState(false)

    const dispatch = useDispatch()
    React.useEffect(()=>{
        // setFirstname(info.firstname)
        // setLastname(info.lastname)
    },[])

    const updateUser = (e) =>{
        e.preventDefault()
        e.stopPropagation()
        if(validate())
        {
            dispatch(showSpinner(true))
            postServerWithDataAndAuth(UPDATEUSER,{
                id:info.id,
                email:info.email,
                password:curPassword,
                newPassword : newPassword
            })
            .then(res=>{
                showToast("User Password has been updated")
                dispatch(showSpinner(false))
            })
            .catch(err=>{
                showToast(err.response,'error')
                dispatch(showSpinner(false))
            })
        }
        else
        {
            showToast("Password validation failed",'error')
        }
        setValidated(true)
    }

    /*  validate()
     *  Validate form before send to server
    */
    const validate = () => {
        var passwordFormat = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
        return passwordFormat.test(newPassword) && newPassword === confirmPassword && passwordFormat.test(curPassword)
    }

    return (
        <div className="settingBody">
            <h2>Change Password</h2>
            <hr/>
            <Form noValidate onSubmit={(e)=>updateUser(e)} className="settingUserForm">
                <Form.Group controlId="curPassword">
                    <Form.Label>
                        Current Password
                        </Form.Label>
                    <Form.Control type="password" placeholder="Current Password" required
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                onChange={e=>setCurPassword(e.target.value)} 
                                isValid={(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/).test(curPassword)}
                                isInvalid={!(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/).test(curPassword) && validated}
                    />
                    <Form.Control.Feedback type="invalid">
                        Password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>
                        New Password
                        </Form.Label>
                    <Form.Control type="password" placeholder="Password" required
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                onChange={e=>setNewPassword(e.target.value)} 
                                isValid={(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/).test(newPassword)}
                                isInvalid={!(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/).test(newPassword) && validated}
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
                                isValid={newPassword === confirmPassword && confirmPassword.length > 0 && (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/).test(newPassword)}
                                isInvalid={(newPassword !==confirmPassword || confirmPassword.length === 0 || !(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/).test(newPassword)) && validated}
                    />
                    <Form.Control.Feedback type="invalid">
                        {
                            newPassword !== confirmPassword ? "Password does not match"
                            : "Password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                        }
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="buttons">
                    <Button variant="outline-primary" type="submit" className="float-right">Change Password</Button>
                </Form.Group>
                <br/>
                <br/>
            </Form>
        </div>
    )
}