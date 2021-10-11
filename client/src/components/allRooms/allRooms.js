import React, { useState, useEffect } from 'react'
import Details from '../details/details'
import './allRooms.css'

const AllRooms = () => {

    const [allRooms, setAllRooms] = useState([])
    const [roomId, setRoomId] = useState()

    useEffect(() => {
        getAllRooms();
    }, [])

    const getAllRooms = async () => {
        try {
            const response = await fetch("/allRooms");
            const jsonData = await response.json();
            setAllRooms(jsonData)

        } catch (error) {
            console.error(error.message)
        }
    }

    return (
        <div className="container">
            <div className="title-all-rooms">Our metting rooms</div>
            <div className="row all-rooms">
                {allRooms.map(room => (
                    <div key={room.room_id} className="card-img">
                        <div className="grey"></div>
                        <img className="room-img" src={room.photos} data-toggle="modal" data-target={`#id${room.room_id}`} alt="room" onClick={() => setRoomId(room.room_id)} />
                        <div className="allrooms-name">{room.name}</div>
                        <div className="allrooms-city">{room.city}</div>
                    </div>
                ))}
            </div>
            <Details room_id={roomId}></Details>
        </div>
    )
}

export default AllRooms
