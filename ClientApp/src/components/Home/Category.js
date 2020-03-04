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
                selectedCategory:store.getState().categoryReducer.selectedCategoryIndex,
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

    /*  getCategoryFromServer()
     *  set Loading until it is fully loaded and shows loading page
     *  send user info to the server and get categories and todos data
     *  after getting data, update its state with corresponding data
    */
    getCategoryFromServer()
    {
        var info = store.getState().userInfo
        this.props.isLoading(false) // reducer

        postServerWithDataAndAuth(GETCATEGORY,{
            id:info.id
        }).then(res=>{
            this.updateCategories(res);
            if(store.getState().categoryReducer.selectedCategoryId === -1 
            && this.state.category.length > 0) // initial value
            {   // when page loaded and not selected any category
                // select first category if onlt category is not empty
                // this will solve selected category will be selected after refresh
                // also, able to add todo when user didn't select any category after login
                this.props.setSelectedCategory(this.state.category[0].id,0) 
            }
        })
    }

    /*  updateCategories(data:{})
     *  set data to store and set loading finished
    */
    updateCategories = (data) =>{
        // update category in store
        // then let component know loading is finished
            this.props.setCategories(data.data.categories)
            this.props.isLoading(true) // reducer
    }

    /*  forceSelect(index:number)
     *  remove all class .active from category panel, add class .active to corresponding category
     *  this will display which category is selected after update page
    */
    forceSelect = (index) =>{
        $('.nav .categoryPanel div.active').removeClass('active');
        $('.nav').find('.categoryPanel').eq(index).children('div').addClass('active')
    }
    
    /*  selectCategory(e:element)
     *  set selected category index from array and its category id
     *  also, remove and add .active class to corresponding category panel
     *  this will display which category is currently selected
    */
    selectCategory = (e) =>{
        this.props.setSelectedCategory(this.state.category[e.target.id].id,e.target.id)
        $(e.target).parent().siblings().children().removeClass('active')
        $(e.target).addClass('active')
    }

    /*  setModalShow(show:boolean, selected:element, isNew:boolean, update:{}, action:string)
     *  if show is true, show modal with data. this shows selectedCategory contents.
     *  also, isNew will make modal for adding category form else modifying form
     *  if show is false, close modal
     *  update is data from server, it updates data in store
     *  action displays what action happened in category modal
     *  depends on action, corresponding category will be selected.
    */
    setModalShow = (show,selected,isNew,update,action) => {
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
            this.updateCategories(update)
            var index
            if(action === "add") // select first category
            {
                index = this.state.category.length // select newly created category
                this.forceSelect(index)
                this.props.setSelectedCategory(this.state.category[index].id,index)
            }
            else if(action === "delete")
            {
                index = this.state.selectedCategory < this.state.category.length-1 ?
                        this.state.selectedCategory : this.state.selectedCategory-1
                this.forceSelect(index)
                this.props.setSelectedCategory(this.state.category[index].id,index)// select right side if possible, else left side
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
                        // after fully loaded, render category panels
                        this.state.isLoaded &&
                        //this.state.category &&
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
            {   // loading finished and category is not undefined and specific category exists
                this.state.isLoaded && this.state.category && this.state.category[this.state.selectedCategory] &&
                <Todos  category={this.state.category[this.state.selectedCategory]} 
                        categoryIndex={this.state.selectedCategory}/>
            }
            {
                // after fully loaded, render category modal
                this.state.isLoaded &&
                <CategoryModal  show={this.state.modalShow} 
                                onHide={(update,action)=>this.setModalShow(false,undefined,false,update,action)} 
                                category={
                                    this.state.isNewCategory ? 
                                    undefined
                                :   this.state.category[this.state.selectedCategory]
                                }/>
            }
        </div>
        )
    }
}

export default connect(
    null,
    {isLoading, setCategories, setSelectedCategory}
)(Category)