import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

import App from './App'
import store from './store'

import { ToastContainer, Bounce } from 'react-toastify'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/Auth'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0, // 3 tentatives maximum par défaut (0 pour désactiver)
      // refetchOnWindowFocus: false, // désactiver le refetch au focus, valeur par défaut true
      // refetchOnMount: false, // désactiver le refetch au montage, valeur par défaut true
      // staleTime: 5 * 60 * 1000, // 5 minutes // durée avant de considérer les données comme "stale", valeur par défaut 0
    },
  },
})

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
    />

    <AuthProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </AuthProvider>
  </QueryClientProvider>,
)
