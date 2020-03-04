import React from 'react'
import Home from './Home/Home'
import Login  from './Login/Login';
import Register  from './Login/Register';

import '../css/Common.css'

export default class Main extends React.PureComponent
{
    renderWhat()
    {
        switch(this.props.contents)
        {
            case 'home' : 
            return <Home/> 
            break;
            case 'login' : 
            return <Login/>
            break;
            case 'register' : 
            return <Register/>
            break;
            default : 
            return null
            break;
        }
    }

    render()
    {
        const contents = this.renderWhat();
        return(
            <div className="mainComponent">
                {
                    contents
                }
            </div>
        )
    }
}