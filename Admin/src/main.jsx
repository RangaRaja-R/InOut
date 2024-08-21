import { createRoot } from 'react-dom/client'
import './index.css'
import { HashRouter } from 'react-router-dom'
import Routing from './Route.jsx'
import { createStoreHook, Provider } from 'react-redux'
import store from './Redux/store.jsx'
import Init from './Components/Init.jsx'
createRoot(document.getElementById('root')).render(<>

  <Provider store={store}>
  
  <HashRouter>

    <Routing/>
  </HashRouter>
  </Provider>
</>
)
