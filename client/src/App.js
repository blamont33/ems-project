import React, { Fragment, useState } from 'react';
import './App.css';
import AllRooms from './components/allRooms/allRooms';
import Background from './components/Background/background';
import MainForm from './components/mainForm/mainForm.js';
import SlideShow from './components/slideShow/slideShow';


function App() {

  const [availableRooms, setAvailableRooms] = useState([])
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")

  return (
    <Fragment>
      <Background availableRooms={availableRooms}></Background>
      <MainForm setAvailableRooms={setAvailableRooms} setCheckIn={setCheckIn} setCheckOut={setCheckOut} checkIn={checkIn} checkOut={checkOut} />
      <SlideShow availableRooms={availableRooms} checkIn={checkIn} checkOut={checkOut}></SlideShow>
      <AllRooms></AllRooms>
    </Fragment>
  );
}

export default App;
