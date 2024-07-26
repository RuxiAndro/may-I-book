import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRoutes from './Routes'
import './index.css'
import { Provider } from 'react-redux'
import {store} from './store'
import { setReservation } from './slices/reservationSlice'

const savedReservations = localStorage.getItem('reservations');//iau starea din localStore
if (savedReservations) {
    store.dispatch(setReservation(JSON.parse(savedReservations))); //setez starea in store
}

// Creează un root React care va monta aplicația
ReactDOM.createRoot(document.getElementById('root')).render( //// Montează aplicația React în elementul cu id-ul 'root'
  <React.StrictMode> 
     <Provider store={store}>
      <AppRoutes />
    </Provider>
  </React.StrictMode>,
)


//React.StrictMode este un component care ajută la detectarea problemelor în aplicație în timpul dezvoltării.