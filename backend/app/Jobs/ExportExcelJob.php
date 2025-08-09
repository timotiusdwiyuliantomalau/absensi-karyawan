<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;

class ExportExcelJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public string $exportClass;
    public string $filePath;

    public function __construct(string $exportClass, string $filePath)
    {
        $this->exportClass = $exportClass;
        $this->filePath = $filePath;
    }

    public function handle(): void
    {
        $temp = Excel::raw(new ($this->exportClass)(), \Maatwebsite\Excel\Excel::XLSX);
        Storage::disk('public')->put($this->filePath, $temp);
    }
}
