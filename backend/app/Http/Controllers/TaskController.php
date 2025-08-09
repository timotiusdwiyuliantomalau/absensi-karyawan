<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use App\Http\Resources\TaskResource;
use Illuminate\Support\Str;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::with(['project','assignee'])
            ->when($request->project_id, fn($q,$id) => $q->where('project_id',$id))
            ->when($request->search, fn($q,$s) => $q->where('title','like',"%$s%"))
            ->orderBy($request->get('sort','due_at'), $request->get('dir','asc'));
        return TaskResource::collection($query->paginate(10));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'assignee_id' => 'nullable|exists:users,id',
            'title' => 'required|string',
            'details' => 'nullable|string',
            'due_at' => 'nullable|date',
        ]);
        $task = new Task($data);
        $task->uuid = (string) Str::uuid();
        $task->save();
        return new TaskResource($task->load(['project','assignee']));
    }

    public function show(Task $task)
    {
        return new TaskResource($task->load(['project','assignee']));
    }

    public function update(Request $request, Task $task)
    {
        $data = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'assignee_id' => 'nullable|exists:users,id',
            'title' => 'required|string',
            'details' => 'nullable|string',
            'due_at' => 'nullable|date',
            'is_done' => 'boolean',
        ]);
        $task->update($data);
        return new TaskResource($task->load(['project','assignee']));
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->noContent();
    }
}
