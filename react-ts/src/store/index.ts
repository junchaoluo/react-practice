import { legacy_createStore, applyMiddleware } from 'redux'
import reducers from './reducers'
import thunk from 'redux-thunk'
import { composeWithDevTools  } from 'redux-devtools-extension'

const store = legacy_createStore(reducers, composeWithDevTools(applyMiddleware(thunk)))

export default store;