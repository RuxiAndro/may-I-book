import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

function Hotel(){
    const [name,setName] = useState('');
    const [description,setDescription] = useState('');
    const [location,setLocation] = useState('');
    const [numberOfRooms,setNumberOfRooms] = useState('');

    const navigate = useNavigate();

    const hotel = {
        name,
        description,
        location,
        numberOfRooms: Number(numberOfRooms),
    };

    //nu merge ok inca nu pot adauga
    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const response= await fetch('https://localhost:3001/hotels', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', //specific tipul de continut al cererii ca fiind JSON
                },
                body: JSON.stringify(hotel),
            });

            if(response.ok){
                const data= await response.json();
                alert('Hotel added successfully!');
                setName('');
                setDescription('');
                setLocation('');
                setNumberOfRooms('');
                navigate(`/room/${data.hotelId}`);
            }else {
                alert("Failed to add hotel");
            } 
        }catch(error){
            alert("Error adding the hotel");
            console.error('Error: ',error);
        }

    };

    

    return (
        <div>
            <h1>
                Add Hotel
            </h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Hotel Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                 <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Number Of Rooms"
                    value={numberOfRooms}
                    onChange={(e) => setNumberOfRooms(e.target.value)}
                    required
                />

                <button type="submit">Add Hotel</button>
            </form>
        </div>
    );
    
}

export default Hotel;