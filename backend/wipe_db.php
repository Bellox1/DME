<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

try {
    echo "Désactivation des FK...\n";
    DB::statement('SET FOREIGN_KEY_CHECKS=0;');
    
    $tables = [
        'role_permissions', 'permissions', 'roles', 'tracabilites', 
        'connexions', 'demandes', 'demande_rdvs', 'prescriptions', 
        'consultations', 'rdvs', 'patients', 'enfants', 'utilisateurs',
        'personal_access_tokens'
    ];

    foreach ($tables as $table) {
        if (Schema::hasTable($table)) {
           echo "Vidage de la table : $table\n";
           DB::table($table)->truncate();
        }
    }

    DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    echo "Base de données vidée avec succès.\n";
    
} catch (\Exception $e) {
    echo "ERREUR : " . $e->getMessage() . "\n";
}
