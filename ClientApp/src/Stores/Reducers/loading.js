import { PURGE } from "redux-persist";
const IS_LOADING = 'loading/IS_LOADING';

export const isLoading = (isloading) => ({ 
  type: IS_LOADING,
    payload:{
      isloading : isloading
    } });

const initialState = {
  isloading : false
}

export default function (state = initialState, action) {
    switch (action.type) {
      case IS_LOADING:
        const {isloading} = action.payload
        return {
          ...state,
          isloading:isloading
        };
      case PURGE:
        return initialState
      default:
        return state;
    }
  }
  