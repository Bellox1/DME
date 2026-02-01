<?php

namespace App\Services;

use App\Models\Tracabilite;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Auth;

class TraceService
{
    /**
     * Record a system action.
     *
     * @param string $action       Action name (e.g., 'creation', 'modification')
     * @param string $table        Table affected (e.g., 'patients')
     * @param string $newValue     Description or new value
     * @param string $oldValue     (Optional) Old value
     * @param string $level        Level (info, success, warning, error)
     * @param int|null $userId     (Optional) Explicit user ID, defaults to auth user
     */
    public static function record($action, $table, $newValue, $oldValue = null, $level = 'info', $userId = null)
    {
        try {
            Tracabilite::create([
                'utilisateur_id' => $userId ?? Auth::id(),
                'action' => $action,
                'nom_table' => $table,
                'ancienne_valeur' => $oldValue,
                'nouvelle_valeur' => $newValue
            ]);
        } catch (\Exception $e) {
            // Failsafe: Don't break the app if logging fails
            \Illuminate\Support\Facades\Log::error("TraceService Error: " . $e->getMessage());
        }
    }
}
