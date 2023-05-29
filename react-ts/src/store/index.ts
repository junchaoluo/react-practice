// import { legacy_createStore, applyMiddleware } from 'redux'
// import reducers from './reducers'
// import thunk from 'redux-thunk'
// import { composeWithDevTools  } from 'redux-devtools-extension'

// const store = legacy_createStore(reducers, composeWithDevTools(applyMiddleware(thunk)))

// export default store;
// createSlice configStore name initialState reducers extraReducers
import { configureStore } from '@reduxjs/toolkit'
import userSlice from './features/userSlice'

const store = configureStore({
    reducer: {
        user: userSlice
    }
})

export default store