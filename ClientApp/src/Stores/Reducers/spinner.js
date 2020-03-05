import { PURGE } from "redux-persist";
const SHOW_SPINNER = 'spinner/SHOW_SPINNER';

export const showSpinner = (show) => ({ 
  type: SHOW_SPINNER,
    payload:{
      show : show
    } 
});


const initialState = {
  show : false
}

export default function (state = initialState, action) {
    switch (action.type) {
      case SHOW_SPINNER:
        const {show} = action.payload
        return {
          ...state,
          show:show
        };
      case PURGE:
        return initialState
      default:
        return state;
    }
  }
  