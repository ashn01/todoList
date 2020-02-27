import React from 'react'

import '../../css/Todo.css'

export default class Todos extends React.PureComponent
{
    constructor(props) {
        super(props);
        this.state = {
            data :
            [
                {
                    name:"Todo1"
                },
                {
                    name:"Todo2"
                },
                {
                    name:"Todo3"
                }
            ]
        }
    }


    render()
    {
        return(
                <ul className="list-group">
                    {
                        this.state.data.map((v,i)=>{
                            return (
                                <div className="input-group" key={i}>
                                    <div className="input-group-prepend">
                                        <div className="input-group-text">
                                        <input type="checkbox" aria-label="Checkbox for following text input"/>
                                        </div>
                                    </div>
                                    <input type="text" className="todoInput form-control" value={v.name} readOnly/>
                                    <div className="input-group-append" id="button-addon4">
                                        <button className="btn btn-outline-info" type="button">Edit</button>
                                        <button className="btn btn-outline-danger" type="button">Remove</button>
                                    </div>
                                </div>
                            )
                        })
                    }
                </ul>
        )
    }
}