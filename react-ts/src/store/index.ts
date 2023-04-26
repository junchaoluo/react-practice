import { createStore, apllyMiddleware } from 'redux'
import reducers from './reducers'
import thunk from 'redux-thunk'
import { composeWithDevTools  } from 'redux-devtools-extension'

const store = createStore(reducers, composeWithDevTools(apllyMiddleware(thunk)))

export default store;