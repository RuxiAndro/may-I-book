import { createSlice } from "@reduxjs/toolkit";

const reservationSlice = createSlice({ // asteapra o lista de obiecte de tip reservation
    name: 'reservations',//numele slice-ului
    /*initialState:{
        reservations: [], //starea initiala e un obiect cu un array pt rezervari
    },*/   
    initialState: [],
    reducers:{
        addReservation(state, action){ //state=lista rezervarilor,starea curenta a slice-ului
            //action= obiectul care contine informatiile despre actiunea care a fost dispatchata
            state.push(action.payload);//datele trimise pt a actualiza starea
        },
        setReservation(state,action){
            return action.payload;
        }
    }

});

export default reservationSlice.reducer;
export const { addReservation, setReservation } = reservationSlice.actions;

//state va fi un obiect cu cheia 'reservatios', iar aceasta cheie contine array-ul de rezervari