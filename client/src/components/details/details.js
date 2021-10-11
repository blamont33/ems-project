import React, { useState, useEffect } from 'react'

const Modal = ({ room_id }) => {

    const [equipments, setEquipments] = useState([])
    const [room, setRoom] = useState([])

    const getEquipment = async () => {
        try {
            const response = await fetch(`/roomequipments/${room_id}`);
            const jsonData = await response.json();
            setEquipments(jsonData)

        } catch (error) {
            console.error(error.message)
        }
    }

    const getRoomById = async () => {
        try {
            const response = await fetch(`/room/${room_id}`);
            const jsonData = await response.json();
            setRoom(jsonData[0])
        } catch (error) {
            console.error(error.message)
        }
    }

    useEffect(() => {
        getEquipment();
        getRoomById();
    }, [room_id])

    return (
        <div>
            <div className="modal" id={`id${room_id}`}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">{room.name}</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <b>Equipments :</b>
                            {equipments.map((eq, index) => {
                                return <div key={index}>{eq.name} : {eq.quantity} </div>
                            })}
                            <br></br>
                            <b>Address :</b>
                            <div>{room.street}</div>
                            <div>{room.postal_code} - {room.city}</div>
                            <br></br>
                            <b>Maximum participants :</b> {room.nb_participants}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal
