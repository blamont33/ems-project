const express = require("express")
const app = express();
require("dotenv").config()
const cors = require("cors")
const pool = require("./db")
const sgMail = require('@sendgrid/mail')
const PORT = process.env.PORT || 5000
const path = require("path");

//middleware
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "client/build")));
  }

//Select all cities
app.get("/cities", async (req, res) => {
    try {
        const allCities = await pool.query("select distinct city from room");

        res.json(allCities.rows);
    } catch (error) {
        console.error(error.message)
    }
})

//select all equipments
app.get("/equipments", async (req, res) => {
    try {
        const allEquipements = await pool.query("select * from equipment")
        res.json(allEquipements.rows)
    } catch (error) {
        console.error(error.message)
    }
})

//select filtered rooms
app.get("/rooms", async (req, res) => {

    var unavailableRoomsArray = [];
    try {
        const { city, check_in, check_out, participants, equipments } = req.query;

        //select unavailable rooms for the chosen dates
        const unavailableRooms = await pool.query("select r.room_id from room r inner join reservation r2 on r.room_id = r2.room_id where" +
            " r.city = $1 and ($2 between r2.check_in and r2.check_out or $3 between r2.check_in" +
            " and r2.check_out or r2.check_in between $2 and $3" +
            " or r2.check_out between $2 and $3) group by r.room_id", [city, check_in, check_out])

        //making an array of these rooms
        unavailableRooms.rows.forEach(element => unavailableRoomsArray.push(element.room_id))

        //making dynamic request
        var room_id = ""
        var equipment_id = ""

        unavailableRoomsArray.forEach(element => room_id = room_id + `and r.room_id != ${element} `)

        if (equipments) {
            equipment_id = "and er.equipment_id in ("
            equipments.forEach(element => equipment_id = equipment_id + `${element}, `)
            equipment_id = equipment_id.substring(0, equipment_id.length - 2)
            equipment_id = equipment_id + ")"
        }

        //select rooms that are not unavailable in the selected city, with selected participants and equipments
        const availableRooms = await pool.query("select r.* from room r left join reservation r2 on r.room_id = r2.room_id left join equipment_room er on er.room_id = r.room_id" +
            " left join equipment e on e.equipment_id = er.equipment_id where r.city = $1 " +
            room_id + equipment_id + " and r.nb_participants >= $2 group by r.room_id", [city, participants]);

        res.json(availableRooms.rows)
    } catch (error) {
        console.error(error.message)
    }
})

//Select equipments by room
app.get("/roomequipments/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const equipments = await pool.query("select e.name, er.quantity from equipment e inner join equipment_room er on e.equipment_id = er.equipment_id where er.room_id = $1", [id]);

        res.json(equipments.rows)
    } catch (error) {
        console.error(error.message)
    }
})

//Select a room by ID
app.get("/room/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const room = await pool.query("select * from room where room_id = $1", [id]);

        res.json(room.rows)
    } catch (error) {
        console.error(error.message)
    }
})

//Book a room
app.post("/book", async (req, res) => {

    try {
        const { room_id, email, check_in, check_out } = req.body;

        const checkAvailable = await pool.query("select r.* from room r" +
            " left join reservation r2 ON r2.room_id = r.room_id" +
            " where r.room_id = $1" +
            " and ($2 between r2.check_in and r2.check_out" +
            " or $3 between r2.check_in and r2.check_out" +
            " or r2.check_in between $2 and $3" +
            " or r2.check_out between $2 and $3)", [room_id, check_in, check_out])

        if (checkAvailable.rows.length === 0) {
            const newBook = await pool.query("insert into reservation values (default, $1, $2, $3, $4)", [room_id, email, check_in, check_out]);

            res.json(newBook.rows)
        } else {
            res.json({ message: "This room is already booked" })
        }


    } catch (error) {
        console.error(error.message)
    }
})

//mail sender
sgMail.setApiKey(process.env.API_KEY)

app.post("/send_mail", async (req, res) => {

    let { check_in, check_out, room_name, email } = req.body

    const msg = {
        to: email,
        from: 'blamont33@hotmail.fr',
        subject: 'Room booked',
        text: 'test',
        html: `<div className="email" style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px;
        ">
        <h2>Congratulation, your meeting room is booked!</h2>
        <p>Name of the meeting room : ${room_name}</p>
        <p>Booked from : ${check_in}</p>
        <p>to : ${check_out}</p> 
        
        <p>Thank you</p></div>`
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
})

//select all rooms
app.get("/allRooms", async (req, res) => {
    try {
        const allRooms = await pool.query("select * from room")
        res.json(allRooms.rows)

    } catch (error) {
        console.error(error.message)
    }
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
});

app.listen(PORT, () => {
    console.log(`server has started on port ${PORT}`);
})