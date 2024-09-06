import React from 'react'
import './Switch.css'

const Switch = ({ checked,handlechange}) => {

    return (
        <label className="switch">
            <input type="checkbox"
                checked={checked ? true : false}
                onChange={handlechange} 
            />
            <span className="slider"></span>
        </label>

    )
}

export default Switch