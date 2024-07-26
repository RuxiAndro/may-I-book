import React,{useEffect, useState} from "react";
import Client from "./ClientPage";

function MyApp() {
    const[reservations,setReservations]=useState([]);

    const addReservation = (reservation) => {
        const newRes=reservations.concat(reservation);
        setReservations(newRes);
        //localStorage.setItem(key, value)
        localStorage.setItem("reservations",JSON.stringify(newRes));
    };

    //functia pt incarcarea rezervarilor din localStorage la montarea componentei
    useEffect(() => {

    }
    );
}

export default MyApp;

//nu am mai folosit asta pana la urma