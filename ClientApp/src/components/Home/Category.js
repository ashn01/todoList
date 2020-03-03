import React from 'react'
import $ from 'jquery'

import Todos from './Todos'
import CategoryModal from './CategoryModal'
import {postServerWithDataAndAuth , GETCATEGORY} from '../../APIROUTE'
import {store} from '../../store'
import { connect } from "react-redux";
import { isLoading } from "../../Stores/Reducers/loading";
import { setCategories, setSelectedCategory} from "../../Stores/Reducers/categories";

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
            isLoaded : false
        }
        this.unsubscribe = store.subscribe(()=>{
            this.setState({
                category:store.getState().categoryReducer.categories, 
                selectedCategory:store.getState().categoryReducer.selectedCategory,
                isLoaded : store.getState().isLoading.isloading
            })
        })
    }

    componentDidMount()
    {        
        this.getCategoryFromServer()
    }

    componentWillUnmount()
    {
        this.unsubscribe()
    }

    getCategoryFromServer()
    {
        var info = store.getState().userInfo
        this.props.isLoading(false) // reducer
        

        postServerWithDataAndAuth(GETCATEGORY,{
            id:info.id
        }).then(res=>{
            this.updateCategories(res);
        })
    }

    updateCategories = (data) =>{
            this.props.setCategories(data.data.categories)
            this.props.isLoading(true) // reducer
    }

    forceSelect = (index) =>{
        $('.nav .categoryPanel div.active').removeClass('active');
        $('.nav').find('.categoryPanel').eq(index).children('div').addClass('active')
    }

    selectCategory = (e) =>{
        this.props.setSelectedCategory(e.target.id)
        $(e.target).parent().siblings().children().removeClass('active')
        $(e.target).addClass('active')
    }

    setModalShow = (show,selected,isNew,update,forceSelect) => {
        if(show)
        { // show modal
            this.setState({
                modalShow : show, 
                selectedCategory: selected ? selected.target.id : this.state.selectedCategory,
                isNewCategory : isNew
            })
        }
        else
        { // close modal
            this.setState({
                modalShow : show
            })
        }
        //update data
        if(update !== undefined)
        {
            var index
            if(forceSelect === "add") // select first category
            {
                index = this.state.category.length // select newly created category
                this.props.setSelectedCategory(index)
                this.updateCategories(update)
                this.forceSelect(index)
            }
            else if(forceSelect === "delete")
            {
                index = this.state.selectedCategory < this.state.category.length-1 ?
                        this.state.selectedCategory : this.state.selectedCategory-1
                this.props.setSelectedCategory(index) // select right if possible, else left
                this.updateCategories(update)
                this.forceSelect(index)
            }
        }

    }

    render()
    {
        return(
        <div className="card text-center">
            <div className="card-header">
                <ul className="nav nav-tabs card-header-tabs">
                    {
                        this.state.category &&
                        this.state.category.map((v,i)=>{
                            return (
                                <li className={`nav-item categoryPanel`} key={i} >
                                    <div className={`category nav-link ${this.state.selectedCategory == i ? "active" : ""}`}
                                    onClick={(e)=>this.selectCategory(e)}
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
                this.state.isLoaded && this.state.category && this.state.category[this.state.selectedCategory] &&
                <Todos category={this.state.category[this.state.selectedCategory]} categoryIndex={this.state.selectedCategory}/>
            }
            <CategoryModal  show={this.state.modalShow} 
                            onHide={(update,forceSelect)=>this.setModalShow(false,undefined,false,update,forceSelect)} 
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
    {isLoading, setCategories, setSelectedCategory}
)(Category)