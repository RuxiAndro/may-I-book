import React, { useEffect, useState } from "react";

function Room() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [updateData, setUpdateData] = useState({
    number: "",
    type: "",
    pricePerNight: "",
    capacity: "",
    availabilityStartDate: "",
    availabilityEndDate: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("https://localhost:3001/allRooms", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRooms(data);
        } else {
          alert("Failed to fetch rooms");
        }
      } catch (error) {
        console.error("Error fetching rooms: ", error);
      }
    };

    fetchRooms();
  }, []);

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setUpdateData({
      number: room.number,
      type: room.type,
      pricePerNight: room.pricePerNight,
      capacity: room.capacity,
      availabilityStartDate: room.availabilityStartDate.split("T")[0], // Convert to yyyy-mm-dd
      availabilityEndDate: room.availabilityEndDate.split("T")[0],
    });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://localhost:3001/updateRoom/${selectedRoom._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (response.ok) {
        const updatedRoom = await response.json();
        setMessage("Room updated successfully!");
        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room._id === updatedRoom._id ? updatedRoom : room
          )
        );
        setSelectedRoom(null);
      } else {
        setMessage("Failed to update room");
      }
    } catch (error) {
      console.error("Error updating room:", error);
      setMessage("Error updating room");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://localhost:3001/deleteRoom/${selectedRoom._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        setMessage("Room deleted successfully!");
        setRooms((prevRooms) =>
          prevRooms.filter((room) => room._id !== selectedRoom._id)
        );
        setSelectedRoom(null);
      } else {
        setMessage("Failed to delete room");
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      setMessage("Error deleting room");
    }
  };

  return (
    <div>
      <h2>Available Rooms</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room._id}>
            Room {room.number} - {room.type} - ${room.pricePerNight}/night
            <button onClick={() => handleSelectRoom(room)}>Select</button>
          </li>
        ))}
      </ul>

      {selectedRoom && (
        <div>
          <h3>Selected Room</h3>
          <form onSubmit={handleUpdateSubmit}>
            <label>
              Room Number:
              <input
                type="text"
                name="number"
                value={updateData.number}
                onChange={handleUpdateChange}
                required
              />
            </label>
            <label>
              Room Type:
              <input
                type="text"
                name="type"
                value={updateData.type}
                onChange={handleUpdateChange}
                required
              />
            </label>
            <label>
              Price Per Night:
              <input
                type="number"
                name="pricePerNight"
                value={updateData.pricePerNight}
                onChange={handleUpdateChange}
                required
              />
            </label>
            <label>
              Capacity:
              <input
                type="number"
                name="capacity"
                value={updateData.capacity}
                onChange={handleUpdateChange}
                required
              />
            </label>
            <label>
              Availability Start Date:
              <input
                type="date"
                name="availabilityStartDate"
                value={updateData.availabilityStartDate}
                onChange={handleUpdateChange}
                required
              />
            </label>
            <label>
              Availability End Date:
              <input
                type="date"
                name="availabilityEndDate"
                value={updateData.availabilityEndDate}
                onChange={handleUpdateChange}
                required
              />
            </label>
            <button type="submit">Update Room</button>
          </form>
          <button onClick={handleDelete}>Delete Room</button>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default Room;
