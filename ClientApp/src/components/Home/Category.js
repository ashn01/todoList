import React from 'react'
import $ from 'jquery'

import Todos from './Todos'
import CategoryModal from './CategoryModal'
import {postServerWithDataAndAuth , GETCATEGORY} from '../../APIROUTE'
import {store} from '../../store'
import { connect } from "react-redux";
import { isLoading } from "../../Stores/Reducers/loading";

import '../../css/Category.css'
import 'bootstrap/dist/css/bootstrap.min.css';

class Category extends React.PureComponent
{
    constructor(props) {
        super(props);
        this.state = {
            category : [],
            modalShow : false,
            selectedCategory : 0,
            isNewCategory : false,
            isLoaded: false
        }
    }

    componentDidMount()
    {        
        this.getCategoryFromServer()
    }

    getCategoryFromServer()
    {
        var info = store.getState().userInfo
        this.setState({isLoaded:false},()=>{
            this.props.isLoading(this.state.isLoaded) // reducer
        })

        postServerWithDataAndAuth(GETCATEGORY,{
            id:info.id
        }).then(res=>{
            this.setState({category : res.data.categories, isLoaded:true},()=>{
                this.props.isLoading(this.state.isLoaded) // reducer
                $('.nav .categoryPanel').click((e)=>{
                    $('.nav .categoryPanel div.active').removeClass('active');
                    $(e.target).addClass('active');
                    this.setState({selectedCategory : e.target.id >= this.state.category.length ? 0 : e.target.id})
                });
            })
        })
    }

    setModalShow = (show,selected,isNew,update) => {
        if(show)
        { // show modal
            this.setState({
                modalShow : show, 
                selectedCategory: selected !== undefined ? selected.target.id : this.state.selectedCategory,
                isNewCategory : isNew !== undefined ? isNew : false
            })
        }
        else
        { // close modal
            this.setState({
                modalShow : show
            })
        }

        // update state from server
        if(update !== undefined)
        {
            this.getCategoryFromServer()
        }

    }

    render()
    {
        return(
        <div className="card text-center">
            <div className="card-header">
            <ul className="nav nav-tabs card-header-tabs">
                {
                    this.state.category.map((v,i)=>{
                        return (
                            <li className={`nav-item categoryPanel`} key={i} >
                                <div className={`category nav-link ${i===0 ? "active" : ""}`}
                                onDoubleClick={(e)=>this.setModalShow(true,e,false,undefined)} id={i}>
                                    {v.categoryName} 
                                </div>
                            </li>
                        )
                    })
                }
                <li className="nav-item">
                    <div className="category nav-link" onClick = {()=>this.setModalShow(true,undefined,true,undefined)}>
                        +
                    </div>
                </li>
            </ul>
            </div>
            {
                this.state.isLoaded &&
                <Todos category={this.state.category[this.state.selectedCategory]}/>
            }
            <CategoryModal  show={this.state.modalShow} 
                            onHide={(update)=>this.setModalShow(false,undefined,false,update)} 
                            category={
                                this.state.isNewCategory ? 
                                undefined
                            :   this.state.category[this.state.selectedCategory]
                            }/>
            
        </div>
        
        )
    }
}


export default connect(
    null,
    {isLoading}
)(Category)