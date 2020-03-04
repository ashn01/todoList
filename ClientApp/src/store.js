import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistReducer } from 'redux-persist';
import {createLogger} from 'redux-logger'
import storage from 'redux-persist/lib/storage';
import rootReducer from './Stores'

// keep data in store
const persistConfig = {
    key:'root',
    storage
};

const logger = createLogger();
let middleware = [];

if(process.env.NODE_ENV === 'development')
{
    middleware = [logger]
    console.log("development")
}
else
{
    middleware= [...middleware]
    console.log("production")
}

const enhancedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(enhancedReducer,compose(applyMiddleware(...middleware)));
const persistor = persistStore(store);

export {store, persistor};
