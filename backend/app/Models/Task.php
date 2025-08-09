<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use OwenIt\Auditing\Auditable;
use Illuminate\Support\Str;

class Task extends Model implements AuditableContract
{
    use SoftDeletes, Auditable;

    protected $fillable = [
        'uuid', 'project_id', 'assignee_id', 'title', 'details', 'due_at', 'is_done', 'extra'
    ];

    protected $casts = [
        'due_at' => 'datetime',
        'is_done' => 'boolean',
        'extra' => 'array',
    ];

    protected static function booted(): void
    {
        static::creating(function (Task $task) {
            if (empty($task->uuid)) {
                $task->uuid = (string) Str::uuid();
            }
        });
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}
