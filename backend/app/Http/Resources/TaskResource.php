<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'title' => $this->title,
            'details' => $this->details,
            'due_at' => $this->due_at,
            'is_done' => $this->is_done,
            'project_id' => $this->project_id,
            'assignee' => $this->whenLoaded('assignee', fn() => new UserResource($this->assignee)),
        ];
    }
}
