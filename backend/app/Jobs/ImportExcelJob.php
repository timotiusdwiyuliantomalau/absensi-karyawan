<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Maatwebsite\Excel\Facades\Excel;

class ImportExcelJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public string $importClass;
    public string $path;

    public function __construct(string $importClass, string $path)
    {
        $this->importClass = $importClass;
        $this->path = $path;
    }

    public function handle(): void
    {
        Excel::import(new ($this->importClass)(), $this->path, 'public');
    }
}
