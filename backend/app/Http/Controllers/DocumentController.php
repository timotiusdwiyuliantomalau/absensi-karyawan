<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use App\Http\Resources\DocumentResource;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $query = Document::query()
            ->when($request->project_id, fn($q,$id)=>$q->where('project_id',$id))
            ->when($request->task_id, fn($q,$id)=>$q->where('task_id',$id))
            ->orderBy($request->get('sort','created_at'), $request->get('dir','desc'));
        return DocumentResource::collection($query->paginate(10));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'project_id' => 'nullable|exists:projects,id',
            'task_id' => 'nullable|exists:tasks,id',
            'file' => 'required|file|mimetypes:application/pdf|between:100,500',
        ]);
        $file = $data['file'];
        $path = $file->store('docs', 'public');
        $doc = Document::create([
            'uuid' => (string) Str::uuid(),
            'project_id' => $data['project_id'] ?? null,
            'task_id' => $data['task_id'] ?? null,
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'mime' => $file->getMimeType(),
            'size_kb' => (int) ceil($file->getSize()/1024),
        ]);
        return new DocumentResource($doc);
    }

    public function show(Document $document)
    {
        return new DocumentResource($document);
    }

    public function update(Request $request, Document $document)
    {
        $data = $request->validate([
            'project_id' => 'nullable|exists:projects,id',
            'task_id' => 'nullable|exists:tasks,id',
        ]);
        $document->update($data);
        return new DocumentResource($document);
    }

    public function destroy(Document $document)
    {
        if ($document->path) {
            Storage::disk('public')->delete($document->path);
        }
        $document->delete();
        return response()->noContent();
    }
}
