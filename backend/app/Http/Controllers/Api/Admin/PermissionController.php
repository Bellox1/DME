<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PermissionController extends Controller
{
    /**
     * Get all roles and their permissions
     */
    public function index()
    {
        $roles = DB::table('roles')->get();
        $permissions = DB::table('permissions')->get();
        
        $rolePermissions = DB::table('role_permissions')
            ->select('role_id', 'permission_id')
            ->get();

        return response()->json([
            'roles' => $roles,
            'permissions' => $permissions,
            'rolePermissions' => $rolePermissions
        ]);
    }

    /**
     * Update permissions for a specific role
     */
    public function update(Request $request)
    {
        $request->validate([
            'role_id' => 'required',
            'permission_ids' => 'present|array'
        ]);

        $roleId = $request->role_id;
        $permissionIds = $request->permission_ids;

        try {
            DB::beginTransaction();

            // Delete existing permissions for this role
            DB::table('role_permissions')->where('role_id', $roleId)->delete();

            // Insert new permissions
            $data = [];
            foreach ($permissionIds as $pId) {
                if ($pId) {
                    $data[] = [
                        'role_id' => $roleId,
                        'permission_id' => $pId,
                        'date_creation' => now(),
                        'date_modification' => now()
                    ];
                }
            }

            if (!empty($data)) {
                DB::table('role_permissions')->insert($data);
            }

            DB::commit();

            return response()->json(['message' => 'Permissions mises à jour avec succès.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur lors de la mise à jour: ' . $e->getMessage()], 500);
        }
    }
}
