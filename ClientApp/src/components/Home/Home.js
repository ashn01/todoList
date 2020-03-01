import React from 'react'
import { ToastContainer } from 'react-toastify';
import {Spinner} from 'react-bootstrap'

import Header from '../Header/Header'
import Category from './Category'
import {store} from '../../store'
import 'react-toastify/dist/ReactToastify.css';

export default class Home extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.state={
            isLoaded:false
        }
        this.unsubscribe = store.subscribe(()=>{
            this.setState({isLoaded:store.getState().isLoading.isloading})
        })
    }

    componentWillUnmount()
    {
        this.unsubscribe();
    }
    
    render()
    {
        
        return(
        <div className="homeComponent">
            <Header/>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop 
                            closeOnClick rtl={false} pauseOnVisibilityChange
                            draggable pauseOnHover
            />
            <Category/>
            <div className={`hideBack ${this.state.isLoaded ? "" : "active"}`}>
                <div className="spinnerContainer">
                    <Spinner animation="border" variant="primary" />    
                </div>
            </div>
        </div>
        )
    }
}