import React, { useEffect } from 'react'

import Header from '../Header/Header'
import Category from './Category'

export default function Home() {
    useEffect(()=>{

        // will unmount
        return ()=>{
            
        }
    }, [])

    return(
        <div className="homeComponent">
            <Header/>
            <Category/>
            
        </div>
        )
}
