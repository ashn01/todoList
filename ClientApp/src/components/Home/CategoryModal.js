import React, {useState} from 'react'
import {Modal, Button, InputGroup, FormControl, Alert} from 'react-bootstrap'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";

import { showSpinner } from "../../Stores/Reducers/spinner";
import {postServerWithDataAndAuth , ADDCATEGORY, MODIFYCATEGORY, DELETECATEGORY} from '../../APIROUTE'

export default function CategoryModal(props) {
    const [categoryName, setCategoryName] = useState(props.category !== undefined ? 
                                                        props.category.categoryName 
                                                    :   "");
    const [categoryId, setCategoryId] = useState(props.category !== undefined ? 
                                                    props.category.id 
                                                :   -1);
    const [showAlert, setShowAlert] = useState(false)
    const dispatch = useDispatch()
    const info = useSelector(state => state.userInfo)

    React.useEffect(()=>{
        if(props.category !== undefined)
        {
            setCategoryName(props.category.categoryName);
            setCategoryId(props.category.id);
        }
        else
        {
            setCategoryName("");
            setCategoryId(-1);
        }
        setShowAlert(false)
    }, [props.category])
    
    /*
     * modifyCategory()
     * send owner category, category id, and modified category name
     * after modifying, modal closed and send categories data to parent function 
    */
    const modifyCategory = () =>{
        dispatch(showSpinner(true))
        postServerWithDataAndAuth(MODIFYCATEGORY, {
            owner: info.id,
            id: categoryId,
            categoryname:categoryName
        }).then(res => {
            dispatch(showSpinner(false))
            showToast(props.category.categoryName + " category modified!")
            props.onHide(res, "modify") // true to update
        }).catch(err=>{
            dispatch(showSpinner(false))
        })
    }

    /*
     * addCategory()
     * send owner category, and category name
     * after adding, modal closed and send categories data to parent function 
    */
    const addCategory = () =>{
        dispatch(showSpinner(true))
        if(categoryName !== "")
        {
            postServerWithDataAndAuth(ADDCATEGORY,{
                owner:info.id, 
                categoryname:categoryName
            }).then(res=>{
                dispatch(showSpinner(false))
                showToast(categoryName + " category added!")
                setCategoryName("");
                setCategoryId(-1);
                props.onHide(res,"add") // true to update
            }).catch(err=>{
                dispatch(showSpinner(false))
            })
        }
        else
        {
            console.log("Category name is required")
        }
    }

    /*
     * deleteCategory()
     * send owner category, and category id
     * after deleting, modal closed and send categories data to parent function 
    */
    const deleteCategory = () => {
        dispatch(showSpinner(true))
        postServerWithDataAndAuth(DELETECATEGORY, {
            owner: info.id,
            id: categoryId
        }).then(res => {
            dispatch(showSpinner(false))
            showToast(categoryName + " category deleted!")
            props.onHide(res,"delete") // true to update
        }).catch(err=>{
            dispatch(showSpinner(false))
        })
    }

    /*
     * showToast(content:string)
     * showing toast with string
    */
    const showToast = (content) =>{
        toast(content,{position:"top-right", 
                            autoClose: 3000, hideProgressBar:true, newestOnTop:true,
                            closeOnClick: true, pauseOnHover: true, draggable: true})
    }

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
              {
                  props.category !== undefined ? "Modify "+props.category.categoryName : "Add Category"
              }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <InputGroup className="mb-3">
            <FormControl
            placeholder="Category name"
            value = {categoryName}
            onChange={(e)=>setCategoryName(e.target.value)}
            required
            />
        </InputGroup>
        </Modal.Body>
        <Modal.Footer>
            {   // if category is not undefined, shows delete button
                props.category !== undefined && 
                <Button variant="danger" onClick={() => setShowAlert(true)}>Delete</Button>
            }
            {   // if category is not undefined, shows modify button, else shows add button
                props.category !== undefined ?
                    <Button onClick={()=>modifyCategory()}>Modify</Button>
                :
                    <Button variant="primary" onClick={()=>addCategory()}>Add</Button>
            }
            <Button variant="outline-primary" onClick={()=>props.onHide(undefined, false)}>Close</Button>
        </Modal.Footer>
        
        <Alert show={showAlert} variant="danger">
            <Alert.Heading>This action is undoable.</Alert.Heading>
            <p>
                Deleting Category will delete all of todos in the category.            
            </p>
            <hr />
            <div className="d-flex justify-content-between">
                <Button onClick={()=>deleteCategory()} variant="outline-danger">
                    Delete Anyway
                </Button>
                <Button onClick={() => setShowAlert(false)} variant="outline-primary">
                    Cancel
                </Button>
            </div>
        </Alert>

      </Modal>
    );
  }

