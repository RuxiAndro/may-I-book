import { configureStore } from "@reduxjs/toolkit";
import reservationReducer, { setReservation } from './slices/reservationSlice';
//aici voi configura stor-ul redux ,va contine starea globala a rezervarilor
import userReducer from './slices/userSlice';

//pt persistenta datelor chiar si dupa reincarcarea paginii
const loadStateFromLocalStorage = () => {
    try {
        const serialized = localStorage.getItem('reservations');
        if (serialized === null) {
            return { reservations: [] }; //store-ul va folisi starea initiala def in reducer,adica []
        }
        return { reservations: JSON.parse(serialized) };
    } catch (err) {
        console.error('Could not load state from localStorage', err);
        return { reservations: [] };
    }
};

const saveStateToLocalStorage = (state) => {
    try {
        const serialized = JSON.stringify(state.reservations); //transform in string
        localStorage.setItem('reservations', serialized);
    } catch (err) {
        console.error('Could not save state to localStorage', err);
    }
};

//const preloadedState = loadStateFromLocalStorage();

// creez store-ul redux
const store = configureStore({
    reducer: {
        reservations: reservationReducer, //creat de catre createSlice
        user: userReducer,
    },
    preloadedState: loadStateFromLocalStorage(), //init storul cu preload daca exista daca nu va folosi starea init din slice
});


store.subscribe(() => { //listener care se declanseaza cand starea stor ului se schimba
    const state = store.getState();
   // console.log('Current state:', state.reservations);
    saveStateToLocalStorage(state);
});

export { store };