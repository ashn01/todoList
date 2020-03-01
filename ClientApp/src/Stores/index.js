import {combineReducers} from 'redux'
import userInfo from './Reducers/userInfo'
import headerPanel from './Reducers/headerPanel'
import isLoading from './Reducers/loading'

export default combineReducers ({
    userInfo,
    headerPanel,
    isLoading,
})