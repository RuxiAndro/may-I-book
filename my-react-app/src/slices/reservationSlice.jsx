import { createSlice } from "@reduxjs/toolkit";

const reservationSlice = createSlice({
    name: 'reservations',//numele slice-ului
    initialState:[],   //starea initiala a slice-ului,o lista goala care ulterior va contine rezervarile
    reducers:{
        addResevation(state,action){ //state=lista rezervarilor,starea curenta a slice-ului
            //action= obiectul care contine informatiile despre actiunea care a fost dispatchata
            state.push(action.payload);//datele trimise pt a actualiza starea
        },
        setReservation(state,action){
            return action.payload;
        }
    }

});

export default reservationSlice.reducer;
export const {addResevation,setReservation}=reservationSlice.actions;