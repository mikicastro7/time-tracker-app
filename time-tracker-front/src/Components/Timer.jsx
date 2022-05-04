/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";

const Timer = function (props) {
    const [seconds, setSeconds] = useState("00")
    const [minutes, setMinutes] = useState("00")
    const [hours, setHours] = useState("00");
    const [time, setTime] = useState(props.startedAt);

    function msToTime(duration) {
        var seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return [hours, minutes, seconds];
    }

    useEffect(() => {
        let interval = null;
        if (props.startedAt == null) {
            setSeconds("00");
            setMinutes("00");
            setHours("00");
            return;
        }
        var timestamp = new Date().getTime();
        const passedTime = timestamp - props.startedAt * 1000;
        const times = msToTime(passedTime);
        setHours(times[0])
        setMinutes(times[1])
        setSeconds(times[2])
        setHours(times[0])
        setMinutes(times[1])
        setSeconds(times[2])
        if (props.startedAt != null) {
            interval = setInterval(() => {
                setTime((time) => time + 10);
            }, 10);
        }

        return () => {
            clearInterval(interval);
        };
    }, [props.startedAt, time]);

    return (
        <div className="timer">
            <p>{hours}:{minutes}:{seconds}</p>
        </div>
    );
};

export default Timer;
