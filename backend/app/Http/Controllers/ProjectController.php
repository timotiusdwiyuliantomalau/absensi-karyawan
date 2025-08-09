<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use App\Http\Resources\ProjectResource;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::with(['owner'])->when($request->search, function($q,$s){
            $q->where('name','like',"%$s%");
        })->orderBy($request->get('sort','created_at'), $request->get('dir','desc'));
        return ProjectResource::collection($query->paginate(10));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);
        $project = new Project($data);
        $project->uuid = (string) Str::uuid();
        $project->owner_id = $request->user()->id;
        $project->save();
        return new ProjectResource($project->load('owner'));
    }

    public function show(Project $project)
    {
        return new ProjectResource($project->load('owner'));
    }

    public function update(Request $request, Project $project)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);
        $project->update($data);
        return new ProjectResource($project->load('owner'));
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return response()->noContent();
    }
}
