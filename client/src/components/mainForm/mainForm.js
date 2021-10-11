import React, { Fragment, useEffect, useState, useRef } from 'react'
import { dateOfTheDay } from '../../Utils/utils'
import './mainForm.css'

function MainForm({ setAvailableRooms, setCheckIn, setCheckOut, checkIn, checkOut }) {

    const [equipmentsForm, setEquipmentsForm] = useState("equipments-form-a")
    const [city, setCity] = useState("")
    const [participants, setParticipants] = useState("")
    const [equipments, setEquipments] = useState([])
    const [cities, setCities] = useState([])
    const [allEquipments, setAllEquipments] = useState([])
    const [noResults, setNoresults] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState("checkboxes-close");
    const ref = useRef();

    //Close dropdown if click outside
    useEffect(() => {
        const checkIfClickedOutside = (e) => {
            if (isMenuOpen && ref.current && !ref.current.contains(e.target)) {
                setIsMenuOpen("checkboxes-close");
            }
        };
        document.addEventListener("mousedown", checkIfClickedOutside);
        return () => {
            document.removeEventListener("mousedown", checkIfClickedOutside);
        };
    }, [isMenuOpen]);


    const getCities = async () => {
        try {
            const response = await fetch("/cities")
            const jsonData = await response.json()

            setCities(jsonData)
        } catch (error) {
            console.error(error.message)
        }
    }

    const getEquipments = async () => {
        try {
            const response = await fetch("/equipments")
            const jsonData = await response.json()

            setAllEquipments(jsonData)
        } catch (error) {
            console.error(error.message)
        }
    }

    useEffect(() => {
        getCities();
        getEquipments();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        var url = `/rooms?city=${city}&check_in=${checkIn}&check_out=${checkOut}&participants=${participants}`
        if (equipments) {
            equipments.forEach(element => url = url + `&equipments[]=${element}`)
        }
        try {
            const response = await fetch(url)
            const jsonData = await response.json()
            setAvailableRooms(jsonData)
            if (jsonData.length === 0) {
                setNoresults(true)
            } else {
                setNoresults(false)
            }
        } catch (error) {
            console.error(error.message)
        }
        setEquipmentsForm("equipments-form-b")
    }

    //Add all checked equipments to a list
    const handleEquipment = (id) => {
        if (!equipments.includes(id)) {
            let add = [...equipments, id]
            setEquipments(add)
        } else {
            var index = equipments.indexOf(id)
            var equipmentBis = equipments
            equipmentBis.splice(index, 1)
        }
        setEquipmentsForm("equipments-form-b")
    }

    //Open or close dropdown
    const showCheckboxes = () => {
        if (isMenuOpen === "checkboxes-close") {
            setIsMenuOpen("checkboxes")
        } else {
            setIsMenuOpen("checkboxes-close")
        }
    }

    return (
        <Fragment>
            <form className="row main-form" onSubmit={handleSubmit}>
                <div className={city ? 'city-form-b' : 'city-form-a'}>
                    <label className="city-label" htmlFor="city-field">City</label>
                    <select className="city-field" required onChange={(e) => { setCity(e.target.value) }}>
                        <option></option>
                        {cities.map(city => (<option key={city.city}>{city.city}</option>))}
                    </select>
                </div>
                <div className={checkIn ? 'checkIn-form-b' : 'checkIn-form-a'}>
                    <label className="checkIn-label" htmlFor="checkIn-field">Check-in</label>
                    <input className="checkIn-field" type="datetime-local" min={dateOfTheDay()} required onChange={(e) => { setCheckIn(e.target.value) }} />
                </div>
                <div className={checkOut ? 'checkOut-form-b' : 'checkOut-form-a'}>
                    <label className="checkOut-label" htmlFor="checkOut-field">Check-out</label>
                    <input className="checkOut-field" type="datetime-local" min={checkIn} required onChange={(e) => { setCheckOut(e.target.value) }} />
                </div>
                <div className={participants ? 'participants-form-b' : 'participants-form-a'}>
                    <label className="participants-label" htmlFor="checkOut-field">Participants</label>
                    <input className="participants-field" type="number" required onChange={(e) => { setParticipants(e.target.value) }} />
                </div>
                <div className={equipmentsForm}>
                    <label className="equipments-label" htmlFor="checkOut-field">Equipments</label>
                    <div className="multiselect" ref={ref}>
                        <div className="selectBox" onClick={showCheckboxes} >
                            <select>
                                <option></option>
                            </select>
                            <div className="overSelect"></div>
                        </div>
                        <div className={isMenuOpen}>
                            {allEquipments.map(equipment => (
                                <label key={equipment.equipment_id}>
                                    <input id="check" className="ml-2" type="checkbox" onChange={() => { handleEquipment(equipment.equipment_id) }} /> {equipment.name}</label>))}
                        </div>

                    </div>
                </div>
                <button className="btn btn-success search">Search</button>
            </form>
            {noResults && <div className="noRoom">No room available</div>}
        </Fragment>

    )
}

export default MainForm
