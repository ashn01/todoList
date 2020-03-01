const IS_LOADING = 'loading/IS_LOADING';

export const isLoading = (isloading) => ({ 
  type: IS_LOADING,
    payload:{
      isloading : isloading
    } });

const initialState = {
  id : 0
}

export default function (state = initialState, action) {
    switch (action.type) {
      case IS_LOADING:
        const {isloading} = action.payload
        return {
          ...state,
          isloading:isloading
        };
      default:
        return state;
    }
  }
  