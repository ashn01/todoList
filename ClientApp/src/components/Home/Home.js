import React, { useEffect } from 'react'
import { useSelector } from "react-redux";

import Header from '../Header/Header'
import Category from './Category'
import Setting from './Setting'

export default function Home() {
    const header = useSelector(state=>state.headerPanel.index)
    useEffect(()=>{

        // will unmount
        return ()=>{
            
        }
    }, [])

    return(
        <div className="homeComponent">
            <Header/>
            <div className={`toggleDiv ${header === 2 ? "hidden" : ""}`}>
                <Category/>
            </div>
            <div className={`toggleDiv ${header === 2 ? "" : "hidden"}`}>
                <Setting/>
            </div>
        </div>
        )
}
