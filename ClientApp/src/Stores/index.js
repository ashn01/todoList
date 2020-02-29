import {combineReducers} from 'redux'
import userInfo from './Reducers/userInfo'
import headerPanel from './Reducers/headerPanel'

export default combineReducers ({
    userInfo,
    headerPanel,
})