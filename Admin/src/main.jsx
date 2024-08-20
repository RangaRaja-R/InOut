import { createRoot } from 'react-dom/client'
import './index.css'
import { HashRouter } from 'react-router-dom'
import Routing from './Route.jsx'
import { createStoreHook, Provider } from 'react-redux'
import store from './Redux/store.jsx'
createRoot(document.getElementById('root')).render(
  
  <HashRouter>
  <Provider store={store}>

    <Routing/>
  </Provider>
  </HashRouter>
)
