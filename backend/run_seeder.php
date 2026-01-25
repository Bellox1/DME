<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Database\Seeders\DatabaseSeeder;
use Illuminate\Support\Facades\DB;

try {
    echo "Démarrage du seeder manuel...\n";
    $seeder = new DatabaseSeeder();
    $seeder->run();
    echo "Seeder terminé avec succès !\n";
} catch (\Exception $e) {
    echo "ERREUR CAPTURÉE :\n";
    echo $e->getMessage() . "\n";
    if (method_exists($e, 'getErrorInfo')) {
        print_r($e->getErrorInfo());
    }
    echo "\nTrace:\n" . $e->getTraceAsString() . "\n";
}
