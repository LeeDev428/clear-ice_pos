<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'                  => 'required|string|max:255',
            'email'                 => 'required|email|max:255|unique:users,email',
            'password'              => ['required', 'confirmed', Password::min(8)],
        ]);

        User::create([
            'name'      => $data['name'],
            'email'     => $data['email'],
            'password'  => $data['password'],
            'is_active' => true,
        ]);

        return back()->with('success', 'User created.');
    }

    public function update(Request $request, User $user)
    {
        $rules = [
            'name'      => 'required|string|max:255',
            'email'     => 'required|email|max:255|unique:users,email,' . $user->id,
            'is_active' => 'sometimes|boolean',
        ];

        if ($request->filled('password')) {
            $rules['password'] = ['required', 'confirmed', Password::min(8)];
        }

        $data = $request->validate($rules);

        $user->name      = $data['name'];
        $user->email     = $data['email'];
        if (isset($data['is_active'])) {
            $user->is_active = $data['is_active'];
        }
        if ($request->filled('password')) {
            $user->password = $data['password'];
        }
        $user->save();

        return back()->with('success', 'User updated.');
    }

    public function destroy(User $user)
    {
        $user->is_active = false;
        $user->save();

        return back()->with('success', 'User deactivated.');
    }
}
