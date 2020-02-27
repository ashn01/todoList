const SET_USERINFO = 'userInfo/SET_USERINFO';

export const setInfo = (id, email, firstName, lastName) => ({ type: SET_USERINFO,
    payload:{
      id : id,
      email : email,
      firstName : firstName,
      lastName : lastName
    } });

const initialState = {
  id : "",
  email : "",
  firstName : "",
  lastName : ""
}

export default function (state = initialState, action) {
    switch (action.type) {
      case SET_USERINFO:
        const {id, email, firstName, lastName} = action.payload
        return {
          ...state,
          id : id,
          email : email,
          firstName : firstName,
          lastName : lastName
        };
      default:
        return state;
    }
  }
  