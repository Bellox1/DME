<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$tables = DB::select('SHOW TABLES');
echo "--- TABLES EN BDD ---\n";
foreach($tables as $t) {
    $prop = "Tables_in_" . env('DB_DATABASE');
    echo "- " . ($t->$prop ?? array_values((array)$t)[0]) . "\n";
}
