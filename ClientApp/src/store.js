import { createStore } from 'redux'
import rootReducer from './Stores'

const store = createStore(rootReducer)

export default store;