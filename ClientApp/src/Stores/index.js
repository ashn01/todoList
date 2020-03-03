import {combineReducers} from 'redux'
import userInfo from './Reducers/userInfo'
import headerPanel from './Reducers/headerPanel'
import isLoading from './Reducers/loading'
import categoryReducer from './Reducers/categories'

export default combineReducers ({
    userInfo,
    headerPanel,
    isLoading,
    categoryReducer
})