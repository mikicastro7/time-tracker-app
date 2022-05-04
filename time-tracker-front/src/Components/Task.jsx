/* eslint-disable react/prop-types */
import React from "react";

const Header = function (props) {

    function convertHMS(value) {
        const sec = parseInt(value, 10); // convert value to number if it's string
        let hours = Math.floor(sec / 3600); // get hours
        let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
        let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
        // add 0 if value < 10; Example: 2 => 02
        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }
        return hours + ':' + minutes + ':' + seconds; // Return is HH : MM : SS
    }

    return (
        <div className="task">
            <h3>{props.name}</h3>
            <p>Started at: {props.startDate.toLocaleDateString()} {props.startDate.toLocaleTimeString()}</p>
            <p>Finished at: {props.endsDate.toLocaleDateString()} {props.endsDate.toLocaleTimeString()}</p>
            <p>Total time: {convertHMS(props.totalTime)}</p>
        </div>
    );
};

export default Header;
