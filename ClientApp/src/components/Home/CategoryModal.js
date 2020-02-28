import React, {useState} from 'react'
import {Modal, Button, InputGroup, FormControl} from 'react-bootstrap'
import {postServerWithDataAndAuth , ADDCATEGORY, MODIFYCATEGORY, DELETECATEGORY} from '../../APIROUTE'

import {store} from '../../store'

export default function CategoryModal(props) {
    const [categoryName, setCategoryName] = useState(props.category !== undefined ? 
                                                        props.category.categoryName 
                                                    :   "");
    const [categoryId, setCategoryId] = useState(props.category !== undefined ? 
                                                    props.category.id 
                                                :   -1);
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
    }, [props.category])
    
    const modifyCategory = () =>{
        var info = store.getState().userInfo
        postServerWithDataAndAuth(MODIFYCATEGORY, {
            owner: info.id,
            id: categoryId,
            categoryname:categoryName
        }).then(res => {
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
            props.onHide(true) // true to update
        })
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
                <Button variant="danger" onClick={deleteCategory}>Delete</Button>
            }
            {
                props.category !== undefined ?
                    <Button onClick={modifyCategory}>Modify</Button>
                :
                    <Button onClick={addCategory}>Add</Button>
            }
            <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }