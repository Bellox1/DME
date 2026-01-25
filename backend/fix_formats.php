<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Utilisateur;
use App\Helpers\PhoneHelper;

$users = Utilisateur::all();
echo "Mise à jour des formats de numéros...\n";
foreach($users as $u) {
    $oldTel = $u->tel;
    $newTel = PhoneHelper::formatBeninTel($u->tel);
    $u->tel = $newTel;
    $u->whatsapp = PhoneHelper::formatBeninWhatsApp($u->whatsapp);
    $u->save();
    echo "- ID {$u->id}: {$oldTel} -> {$newTel}\n";
}
echo "Terminé.\n";
