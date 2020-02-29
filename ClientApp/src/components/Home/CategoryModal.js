import React, {useState} from 'react'
import {Modal, Button, InputGroup, FormControl, Alert} from 'react-bootstrap'
import { toast } from 'react-toastify';
import {postServerWithDataAndAuth , ADDCATEGORY, MODIFYCATEGORY, DELETECATEGORY} from '../../APIROUTE'

import {store} from '../../store'

export default function CategoryModal(props) {
    const [categoryName, setCategoryName] = useState(props.category !== undefined ? 
                                                        props.category.categoryName 
                                                    :   "");
    const [categoryId, setCategoryId] = useState(props.category !== undefined ? 
                                                    props.category.id 
                                                :   -1);
    const [showAlert, setShowAlert] = useState(false)                                        
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
    
    const modifyCategory = () =>{
        var info = store.getState().userInfo
        postServerWithDataAndAuth(MODIFYCATEGORY, {
            owner: info.id,
            id: categoryId,
            categoryname:categoryName
        }).then(res => {
            showToast(props.category.categoryName + " category modified!")
            props.onHide(true) // true to update
        })
    }
    const addCategory = () =>{
        var info = store.getState().userInfo
        if(categoryName !== "")
        {
            postServerWithDataAndAuth(ADDCATEGORY,{
                owner:info.id, 
                categoryname:categoryName
            }).then(res=>{
                showToast(categoryName + " category added!")
                setCategoryName("");
                setCategoryId(-1);
                props.onHide(true) // true to update
            })
        }
        else
        {
            console.log("Category name is required")
        }
    }
    const deleteCategory = () => {
        var info = store.getState().userInfo
        postServerWithDataAndAuth(DELETECATEGORY, {
            owner: info.id,
            id: categoryId
        }).then(res => {
            showToast(categoryName + " category deleted!")
            props.onHide(true) // true to update
        })
    }

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
            {
                props.category !== undefined && 
                <Button variant="danger" onClick={() => setShowAlert(true)}>Delete</Button>
            }
            {
                props.category !== undefined ?
                    <Button onClick={modifyCategory}>Modify</Button>
                :
                    <Button onClick={addCategory}>Add</Button>
            }
            <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>

        <Alert show={showAlert} variant="danger">
            <Alert.Heading>This action is undoable.</Alert.Heading>
            <p>
                Deleting Category will delete all of todos in the category.            
            </p>
            <hr />
            <div className="d-flex justify-content-between">
                <Button onClick={deleteCategory} variant="outline-danger">
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