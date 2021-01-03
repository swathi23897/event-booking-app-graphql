import React from 'react'
import './BookingsControl.css'


const bookingsControl = props => {
    return (
        <div className="bookings__control">
            <button className={props.activeOutputType === "list" ? 'active' : ''} onClick={props.onChangeOutput.bind(this, 'List')}>List</button>
            <button className={props.activeOutputType === "chart" ? 'active' : ''} onClick={props.onChangeOutput.bind(this, 'Chart')}>Chart</button>

        </div>

    )
}

export default bookingsControl;