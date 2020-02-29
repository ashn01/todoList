import React from 'react'
import { ToastContainer, toast } from 'react-toastify';

import Header from '../Header/Header'
import Category from './Category'
import 'react-toastify/dist/ReactToastify.css';

export default class Home extends React.PureComponent
{
    render()
    {
        return(
        <div>
            <Header/>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop 
                            closeOnClick rtl={false} pauseOnVisibilityChange
                            draggable pauseOnHover
            />
            <Category/>
        </div>
        )
    }
}