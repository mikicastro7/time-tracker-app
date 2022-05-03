<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use DateTimeImmutable;

use App\Entity\Task;

class TimeTrackerController extends AbstractController
{
    #[Route('/time-tracker/tasks', name: 'app_time_tracker', methods: "GET")]
    public function getTasksDay(Request $request): Response
    {
        $em = $this->getDoctrine()->getManager();
        $taskRepository = $em->getRepository(Task::class);
        $date = $request->query->get('date') . "%";

        if ($request->query->get('date') == null) {
            $now = new \DateTime('@'.strtotime('now'));
            $date =  $now->format('Y-m-d') . "%";
        }

        $tasks = $taskRepository->findByDate($date);
        
        $tasksData = [];
        $activeTask = [];

        foreach ($tasks as $i => $task) {
            if ($task->getActive() == true) {
                array_push($activeTask, [
                    "id" => $task->getId(),
                    "name" => $task->getName(),
                    "start" => $task->getStartsAt()->getTimestamp(),
                    "end" => $task->getEndsAt(),
                    "active" => $task->getActive()
                ]);
            } else {
                array_push($tasksData, [
                    "id" => $task->getId(),
                    "name" => $task->getName(),
                    "start" => $task->getStartsAt()->getTimestamp(),
                    "end" => $task->getEndsAt()->getTimestamp(),
                    "active" => $task->getActive()
                ]);
            }
        }

        $tasksTimes =  $taskRepository->getTotalTimesTasks($date);

        return $this->json([
            "status" => "success",
            "tasks" => $tasksData,
            "activeTask" => $activeTask,
            "tasks_totals_times" => $tasksTimes,
        ]);
    }

    #[Route('/time-tracker/task/new', name: 'app_time_tracker_new', methods: "POST")]
    public function new(Request $request): Response
    {
        $em = $this->getDoctrine()->getManager();
        $taskRepository = $em->getRepository(Task::class);

        $bodyData = json_decode($request->getContent(), true);

        $activeTask = $taskRepository->findOneBy(["active" => true]);

        if ($activeTask != null) {
            return $this->json([
                "status" => "error",
                "message" => "To start a new task finish the current one"
            ]);
        }

        $task = new Task();
        $task->setName($bodyData["name"]);
        $task->setActive(true);
        $task->setStartsAt(new DateTimeImmutable());

        $em->persist($task);
        $em->flush($task);

        $taskData = [
            "id" => $task->getId(),
            "name" => $task->getName(),
            "start" => $task->getStartsAt()->getTimestamp(),
            "end" => $task->getEndsAt(),
            "active" => $task->getActive()
        ];

        return $this->json([
            "status" => "success",
            "message" => "Task " . $task->getName() . " created",
            "task" => $taskData
        ]);
    }

    #[Route('/time-tracker/task/stop/{taskId}', name: 'app_time_tracker_stop', methods: "PATCH")]
    public function stop(Request $request, $taskId): Response
    {
        $em = $this->getDoctrine()->getManager();
        $taskRepository = $em->getRepository(Task::class);

        $activeTask = $taskRepository->find($taskId);

        if ($activeTask == null) {
            return $this->json([
                "status" => "error",
                "message" => "This task doesn't exists"
            ]);
        } 

        if ($activeTask->getActive() == false) {
            return $this->json([
                "status" => "error",
                "message" => "This task it's not active"
            ]);
        } 

        $activeTask->setEndsAt(new DateTimeImmutable());
        $activeTask->setActive(false);

        $em->persist($activeTask);
        $em->flush($activeTask);

        $taskData = [
            "id" => $activeTask->getId(),
            "name" => $activeTask->getName(),
            "start" => $activeTask->getStartsAt()->getTimestamp(),
            "end" => $activeTask->getEndsAt()->getTimestamp(),
            "active" => $activeTask->getActive()
        ];

        return $this->json([
            "status" => "success",
            "message" => "Task " . $activeTask->getName() . " stoped",
            "task" => $taskData
        ]);
    }
}
