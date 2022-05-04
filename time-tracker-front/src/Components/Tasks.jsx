/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import Task from "./Task";
import useFetch from "../hooks/useFetch";

const Tasks = function (props) {
    const renderTasks = () => {
        if (props.tasks == null) {
            return <p>charging</p>
        } else if (props.tasks.length == 0) {
            return <p>There are no tasks</p>
        } else {
            return props.tasks.map(task => <Task name={task.name} key={task.id} totalTime={task.end - task.start} startDate={new Date(task.start * 1000)} endsDate={new Date(task.end * 1000)} />);
        }
    }
    return (
        <div className="tasks">
            <h2>Tasks logs</h2>
            {renderTasks()}
        </div>
    );
};

export default Tasks;
