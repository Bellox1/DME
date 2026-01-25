<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$search = "58067394";
$users = \App\Models\Utilisateur::where('tel', 'like', "%$search%")->orWhere('whatsapp', 'like', "%$search%")->get();

if ($users->isEmpty()) {
    echo "AUCUNE CORRESPONDANCE TROUVÉE POUR : $search\n";
    echo "Dernier utilisateur inscrit :\n";
    $last = \App\Models\Utilisateur::latest()->first();
    echo "ID: {$last->id} | Nom: {$last->nom} | Tel: {$last->tel}\n";
} else {
    foreach($users as $u) {
        echo "TROUVÉ - ID: {$u->id} | Role: {$u->role} | Nom: {$u->nom} | Tel: [{$u->tel}] | WA: [{$u->whatsapp}]\n";
    }
}
