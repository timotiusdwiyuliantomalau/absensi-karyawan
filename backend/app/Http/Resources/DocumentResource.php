<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'original_name' => $this->original_name,
            'mime' => $this->mime,
            'size_kb' => $this->size_kb,
            'path' => $this->path,
            'project_id' => $this->project_id,
            'task_id' => $this->task_id,
            'created_at' => $this->created_at,
        ];
    }
}
