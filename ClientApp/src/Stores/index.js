import {combineReducers} from 'redux'
import userInfo from './Reducers/userInfo'
import headerPanel from './Reducers/headerPanel'
import loadingReducer from './Reducers/loading'
import categoryReducer from './Reducers/categories'
import spinnerReducer from './Reducers/spinner'

export default combineReducers ({
    userInfo,
    headerPanel,
    loadingReducer,
    categoryReducer,
    spinnerReducer
})