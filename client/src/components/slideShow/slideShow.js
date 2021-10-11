import React, { useState } from 'react'
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa'
import { AiFillCloseCircle } from 'react-icons/ai'
import Book from '../BookForm/book'
import Details from '../details/details'
import './slideShow.css'

const SlideShow = ({ availableRooms, checkIn, checkOut }) => {

    const [current, setCurrent] = useState(0)
    const [roomId, setRoomId] = useState()
    const [roomName, setRoomName] = useState("")
    const length = availableRooms.length

    const nextSlide = () => {
        setCurrent(current === length - 1 ? 0 : current + 1)
    }

    const prevSlide = () => {
        setCurrent(current === 0 ? length - 1 : current - 1)
    }

    if (!Array.isArray(availableRooms) || availableRooms.length <= 0) {
        return null;
    }

    const setRoomDetails = (room_id, name) => {
        setRoomId(room_id);
        setRoomName(name);
    }

    const reset = () => {
        window.location="./"
    }

    return (
        <section className="slider">
            {length > 1 && <FaArrowAltCircleLeft className="left-arrow" onClick={prevSlide} />}
            {length > 1 &&<FaArrowAltCircleRight className="right-arrow" onClick={nextSlide} />}
            <AiFillCloseCircle className="close1" onClick={reset}/>
            {availableRooms.map((room, index) => {
                return (
                    <div key={room.room_id} className={index === current ? 'slide active' : 'slide'}>
                        {index === current && (<img src={room.photos} alt="roomPhoto" className="image" />)}
                        <div className="details">
                            <div className="room-name">{room.name}</div>
                            <div className="room-details">
                                <button type="button" className="btn btn-primary" data-toggle="modal" data-target={`#id${room.room_id}`} onClick={() => setRoomId(room.room_id)}>
                                    details
                                </button>
                                <button type="button" className="btn btn-success ml-2" data-toggle="modal" data-target="#myModal" onClick={() => setRoomDetails(room.room_id, room.name)}>Book</button>
                            </div>
                        </div>
                    </div>
                )
            })}
            <Details room_id={roomId}></Details>
            <Book room_id={roomId} checkIn={checkIn} checkOut={checkOut} room_name={roomName}></Book>
        </section>
       
      
      
    )
}

export default SlideShow;
