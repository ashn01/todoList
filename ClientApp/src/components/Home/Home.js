import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify';
import {Spinner} from 'react-bootstrap'

import Header from '../Header/Header'
import Category from './Category'
import {store} from '../../store'
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

export default function Home() {
    const showSpinner = useSelector(state => state.spinnerReducer.show)
    useEffect(()=>{

        // will unmount
        return ()=>{
            
        }
    }, [])

    return(
        <div className="homeComponent">
            <Header/>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop 
                            closeOnClick rtl={false} pauseOnVisibilityChange
                            draggable pauseOnHover
            />
            <Category/>
            <div className={`hideBack ${showSpinner ?  "active":""}`}>
                <div className="spinnerContainer">
                    <Spinner animation="border" variant="primary" />    
                </div>
            </div>
        </div>
        )
}

// export default class Home extends React.PureComponent
// {
//     constructor(props)
//     {
//         super(props)
//         this.state={
//             showLoading:false
//         }
//         this.unsubscribe = store.subscribe(()=>{
//             //this.setState({showLoading:store.getState().loadingReducer.showLoading})
//         })
//     }

//     componentWillUnmount()
//     {
//         this.unsubscribe();
//     }
    
//     render()
//     {
        
        
//     }
// }