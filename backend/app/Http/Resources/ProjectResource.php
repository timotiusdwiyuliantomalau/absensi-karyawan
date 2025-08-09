<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'name' => $this->name,
            'description' => $this->description,
            'is_active' => $this->is_active,
            'owner' => new UserResource($this->whenLoaded('owner')),
            'tasks' => TaskResource::collection($this->whenLoaded('tasks', $this->tasks()->latest()->take(10)->get())),
            'created_at' => $this->created_at,
        ];
    }
}
