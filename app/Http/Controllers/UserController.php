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

        return redirect()->route('dashboard')->with('success', 'User created.');
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

        $user->name  = $data['name'];
        $user->email = $data['email'];
        if (array_key_exists('is_active', $data)) {
            $user->is_active = $data['is_active'];
        }
        if ($request->filled('password')) {
            $user->password = $data['password'];
        }
        $user->save();

        return redirect()->route('dashboard')->with('success', 'User updated.');
    }

    public function destroy(User $user)
    {
        $user->is_active = false;
        $user->save();

        return redirect()->route('dashboard')->with('success', 'User deactivated.');
    }
}
