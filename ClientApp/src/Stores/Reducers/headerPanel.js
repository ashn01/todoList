import { PURGE } from "redux-persist";
const SET_HEADER = 'headerPanel/SET_HEADER';

export const setHeader = (index) => ({ 
  type: SET_HEADER,
    payload:{
      index : index
    } });

const initialState = {
  index : 0
}

export default function (state = initialState, action) {
    switch (action.type) {
      case SET_HEADER:
        const {index} = action.payload
        return {
          ...state,
          index:index
        };
        
      case PURGE:
        return initialState
      default:
        return state;
    }
  }
  