import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'reset-css'
import App from './App'
import { Provider } from 'react-redux'
import store from '@/store'
import '@/styles/index.scss'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    {/* </React.StrictMode> */}
  </Provider>
)
