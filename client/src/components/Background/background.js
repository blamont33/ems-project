import React from 'react'
import './background.css'
import fond from '../../img/fond3.jpg'

const Background = ({availableRooms}) => {

    return (
        <div>
            <div className="back">
                <img className={availableRooms.length === 0 ? 'img-back' : 'img-back-2'} src={fond} alt="background"></img>
            </div>
            <span className="title">My m<span className="ee">ee</span>ting r<span className="oo">oo</span>m</span>
        </div>
    )
}

export default Background
