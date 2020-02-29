const SET_HEADER = 'headerPanel/SET_HEADER';

export const setHeader = (index) => ({ 
  type: SET_HEADER,
    payload:{
      index : index
    } });

const initialState = {
  id : 0
}

export default function (state = initialState, action) {
    switch (action.type) {
      case SET_HEADER:
        const {index} = action.payload
        return {
          ...state,
          index:index
        };
      default:
        return state;
    }
  }
  