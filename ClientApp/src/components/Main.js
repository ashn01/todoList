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
            case 'home' : return <Home/>
            case 'login' : return <Login/>
            case 'register' : return <Register/>
            default : return null
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