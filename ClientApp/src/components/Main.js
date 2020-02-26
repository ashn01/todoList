import React from 'react'
import Header from './Header/Header'
import Home from './Home/Home'

export default class Main extends React.PureComponent
{
    render()
    {
        return(
            <div>
                <Header/>
                <Home/>
            </div>
        )
    }
}