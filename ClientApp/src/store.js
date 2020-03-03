import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './Stores'

// keep data in store
const persistConfig = {
    key:'root',
    storage
};

const enhancedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(enhancedReducer);
const persistor = persistStore(store);

export {store, persistor};
