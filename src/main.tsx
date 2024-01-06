import * as ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './App'
import store from './store'
import {Provider} from 'react-redux'
import './index.css'

const queryClient = new QueryClient()


ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <App />
    </Provider>,
  </QueryClientProvider>
)
