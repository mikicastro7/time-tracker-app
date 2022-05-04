/* eslint-disable react/prop-types */
import React from "react";
import TaskSumary from "./TaskSummary"

const TasksSummary = function (props) {
    console.log(props.tasksSummary)
    const renderSumary = () => {
        if (props.tasksSummary == null) {
            return <p>charging</p>
        } else if (props.tasksSummary.length == 0) {
            return <p>There are no tasks</p>
        } else {
            return props.tasksSummary.map(task => <TaskSumary convertTime={props.convertTime} name={task.name} key={task.name} totalTime={task.task_total_time} />);
        }
    }
    return (
        <div className="tasks-summary">
            <h2>Tasks Summary</h2>
            {renderSumary()}
            <p className="total-time">Total time tasks: {props.convertTime(props.totalTimeDay)}</p>
        </div>
    );
};

export default TasksSummary;
