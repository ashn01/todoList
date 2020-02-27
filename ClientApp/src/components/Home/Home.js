import React from 'react'

import Header from '../Header/Header'
import Category from './Category'

export default class Home extends React.PureComponent
{
    render()
    {
        return(
        <div>
            <Header/>
            <Category/>
        </div>
        )
    }
}