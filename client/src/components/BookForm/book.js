import React, { useState } from 'react'

const Book = ({ room_id, checkIn, checkOut, room_name }) => {

    const [email, setEmail] = useState("")
    const [booked, setBooked] = useState(false)
    const [message, setMessage] = useState("Your room is booked !")

    //send email
    const handleSend = async () => {
        try {
            const body = { check_in: checkIn, check_out: checkOut, room_name: room_name, email: email }
            await fetch("/send_mail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })
        } catch (error) {
            console.error(error.message)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const body = { room_id: room_id, email: email, check_in: checkIn, check_out: checkOut }
            const response = await fetch("/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })
            const jsonData = await response.json();
            if (jsonData.message) {
                setMessage("This room is already booked")
                setBooked(true)
            } else {
                setMessage("Your room is booked !")
                handleSend();
                setBooked(true)
            }

        } catch (error) {
            console.error(error.message)
        }
    }

    const reset = () => {
        setEmail("");
        setBooked(false);
    }

    return (
        <div>
            <div className="modal" id="myModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Book now</h4>
                            <button type="button" className="close" data-dismiss="modal" onClick={reset}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                {!booked ? <div><b>Email : </b>
                                    <input type="email" className="form-control" required value={email} onChange={e => setEmail(e.target.value)}></input></div> : message}
                            </div>
                            <div className="modal-footer">
                                {!booked && <button type="submit" className="btn btn-success">Submit</button>}
                                <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={reset}>Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Book
