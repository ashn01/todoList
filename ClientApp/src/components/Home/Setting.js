import React,{useState} from 'react'
import { useSelector } from 'react-redux'
import {Form,Button, Jumbotron} from 'react-bootstrap'

import { setHeader } from "../../Stores/Reducers/headerPanel";
import {showToast} from '../../services/Common'
import Account from './Account'
import ChangePassword from './ChangePassword'



export default function Setting()
{
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [curPassword, setCurPassword] = useState('')
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [validated, setValidated] = useState(false)

    const info = useSelector(state=>state.userInfo)

    React.useEffect(()=>{
        setFirstname('')
        setLastname('')
        // setFirstname(info.firstname)
        // setLastname(info.lastname)
    },[])

    /*  handleSubmit(e:element)
     *  send user info to server
     *  if successful, redirect to login page
    */
    const handleSubmit = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (validate()) {
            
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
        var passwordFormat = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
        return passwordFormat.test(password) && password === confirmPassword && passwordFormat.test(curPassword) && firstname.length > 0 && lastname.length > 0
    }

    return (
        <div className="card text-center settingCard">
            <div className="row settingRow">
                <div className="settingTitle">
                    <div className="card-header settingHeader">
                        <div className="nav flex-column settingHeaderItems" id="nav-tab" role="tablist" aria-orientation="vertical">
                            <a className="nav-link active" id="nav-acoount-tab" data-toggle="tab" href="#nav-acoount" role="tab" aria-controls="nav-acoount" aria-selected="false">Account</a>
                            <a className="nav-link" id="nav-user-tab" data-toggle="tab" href="#nav-user" role="tab" aria-controls="nav-user" aria-selected="false">Security</a>
                        </div>
                    </div>
                </div>
                <div className="settingBody">
                    <div className="card-body">
                        <div className="tab-content" id="nav-tabContent">
                            <div className="tab-pane fade show active" id="nav-acoount" role="tabpanel" aria-labelledby="nav-acoount-tab">
                                <Account/>
                            </div>
                            <div className="tab-pane fade" id="nav-user" role="tabpanel" aria-labelledby="nav-user-tab">
                                <ChangePassword/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}