/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import Header from "./Components/Header";
import TaskForm from "./Components/TaskForm";
import Timer from "./Components/Timer";
import Tasks from "./Components/Tasks"
import TasksSummary from "./Components/TasksSummary";
import ActiveTask from "./Components/ActiveTask";
import useHttp from "./hooks/useHttp";
import useFetch from "./hooks/useFetch";

function App() {
  const { sendRequest: createTaskCall } = useHttp();
  const { sendRequest: stopTaskCall } = useHttp();

  const { data: tasksData, requestData: requestTasks } = useFetch();
  const [tasks, setTasks] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [tasksSummary, setTasksSummary] = useState(null);
  const [tasksTotalTimeDay, setTasksTotalTimeDay] = useState(null);

  const createTask = async (taskName, response) => {
    setActiveTask(response.task);
  }

  function createTaskHandler(taskName) {
    createTaskCall({
      url: `${process.env.REACT_APP_SERVER_URL}/time-tracker/task/new`,
      method: "POST",
      body: JSON.stringify({
        name: taskName
      }),
    }, createTask.bind(null, taskName));
  }

  const stopTask = async (response) => {
    setActiveTask([]);
    setTasks(prevState => [...prevState, response.task])
    const taskIndex = tasksSummary.findIndex(taskSummary => taskSummary.name === response.task.name)
    console.log(taskIndex)
    console.log(response.task.end - response.task.start)
    setTasksTotalTimeDay(prevState => prevState += response.task.end - response.task.start)
    if (taskIndex != -1) {
      console.log("entraaaa");
      console.log(response);
      setTasksSummary(prevState => prevState.map((taskSummary, index) => {
        if (index == taskIndex) {
          return {
            ...taskSummary,
            task_total_time: +taskSummary.task_total_time + (response.task.end - response.task.start)
          }
        } else {
          return taskSummary
        }
      }))
    } else {
      setTasksSummary(prevState => [...prevState, {
        name: response.task.name,
        task_total_time: response.task.end - response.task.start
      }].sort((a, b) => a.name.localeCompare(b.name)))
    }
  }

  function stopTaskHandler(taskId) {
    stopTaskCall({
      url: `${process.env.REACT_APP_SERVER_URL}/time-tracker/task/stop/${taskId}`,
      method: "PATCH",
    }, stopTask.bind(null));
  }


  useEffect(() => {
    requestTasks(`${process.env.REACT_APP_SERVER_URL}/time-tracker/tasks`);
  }, []);

  const displayActiveTask = () => {
    console.log(activeTask);
    if (activeTask == null) {
      return <p>charging</p>
    } else if (activeTask.length == 0) {
      return <TaskForm createTask={createTaskHandler} ></TaskForm>
    } else {
      return < ActiveTask stopTask={stopTaskHandler} taskId={activeTask.id} name={activeTask.name} />
    }
  }

  useEffect(() => {
    if (tasksData != null) {
      setTasks(tasksData.tasks);
      setTasksSummary(tasksData.tasksTotalsTimes);
      setTasksTotalTimeDay(tasksData.totalTimeDay);
      if (tasksData.activeTask.length > 0) {
        setActiveTask(tasksData.activeTask[0]);
      } else {
        setActiveTask([]);
      }
    }
  }, [tasksData])

  function convertTime(value) {
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
    <>
      <Header />
      <div className="container">
        {displayActiveTask()}
        <Timer startedAt={activeTask ? activeTask.start : null} ></Timer>
        <TasksSummary totalTimeDay={tasksTotalTimeDay} convertTime={convertTime} tasksSummary={tasksSummary} />
        <Tasks tasks={tasks}></Tasks>
      </div>
    </>
  );
}

export default App;
