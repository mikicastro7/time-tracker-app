/* eslint-disable react/prop-types */
import React, {
    useState
} from "react";

const TaskForm = function (props) {
    const [taskName, setTaskName] = useState("");

    const submitTask = (e) => {
        e.preventDefault();
        if (taskName == "") {
            return
        }

        props.createTask(taskName);
    }

    return (
        <form onSubmit={(e) => submitTask(e)} className="task-form">
            <input onChange={(e) => setTaskName(e.target.value)} value={taskName} type="text" placeholder="Task name" />
            <button type="submit">Create task</button>
        </form>
    );
};

export default TaskForm;
