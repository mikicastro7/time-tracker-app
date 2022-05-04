/* eslint-disable react/prop-types */
import React from "react";

const TaskSummary = function (props) {
    return (
        <div className="task-sumary">
            <h3>{props.name}</h3>
            <p>Task time {props.convertTime(props.totalTime)}</p>
        </div>
    );
};

export default TaskSummary;