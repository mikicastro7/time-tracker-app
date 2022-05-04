/* eslint-disable react/prop-types */
import React from "react";

const ActiveTask = function (props) {
    const stopTask = (e) => {
        e.preventDefault();
        props.stopTask(props.taskId);
    }
    return (
        <div className="active-task-container">
            <h2 className="active-task">{props.name}</h2>
            <form onSubmit={(e) => stopTask(e)}><button type="submit">Stop Task</button></form>
        </div>
    );
};

export default ActiveTask;
