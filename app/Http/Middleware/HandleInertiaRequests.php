<?php

namespace App\Http\Middleware;

use App\Models\CountryCode;
use App\Models\Nationality;
use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'flash' => [
                'success'              => fn () => $request->session()->get('success'),
                'error'                => fn () => $request->session()->get('error'),
                'created_certificate'  => fn () => $request->session()->get('created_certificate'),
            ],
            'countryCodes' => fn () => CountryCode::orderBy('name')->get(['id', 'name', 'dial_code']),
            'nationalityOptions' => fn () => Nationality::orderBy('name')->get(['id', 'name']),
            'programOptions' => fn () => Program::where('is_active', true)
                ->orderBy('title')
                ->get(['id', 'slug', 'title', 'level'])
                ->map(fn (Program $program) => [
                    'id'    => $program->id,
                    'slug'  => $program->slug,
                    'title' => $program->title,
                    'level' => $program->level,
                ])
                ->values(),
        ]);
    }
}
