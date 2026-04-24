<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProgramController extends Controller
{
    protected string $coverPhotoDirectory = 'program-covers';

    public function index(Request $request)
    {
        $query = Program::query();

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('slug', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('level')) {
            $query->where('level', $request->level);
        }

        return Inertia::render('Admin/Programs/Index', [
            'programs' => $query->orderBy('level')->orderBy('title')->get(),
            'filters'  => $request->only(['search', 'level']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Programs/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'slug'        => 'required|string|max:100|unique:programs,slug',
            'title'       => 'required|string|max:255',
            'level'       => 'required|in:Degree,Diploma,Certificate',
            'duration'    => 'required|string|max:50',
            'short'       => 'required|string|max:500',
            'overview'    => 'required|string|max:5000',
            'modules'     => 'nullable|array',
            'modules.*'   => 'string|max:255',
            'careers'     => 'nullable|array',
            'careers.*'   => 'string|max:255',
            'entry'       => 'nullable|array',
            'entry.*'     => 'string|max:255',
            'is_active'   => 'boolean',
            'cover_photo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:10240',
        ]);

        if ($request->hasFile('cover_photo')) {
            $destinationDirectory = public_path($this->coverPhotoDirectory);

            if (! File::isDirectory($destinationDirectory)) {
                File::makeDirectory($destinationDirectory, 0755, true);
            }

            $filename = Str::slug($data['slug']) . '_cover.' . $request->file('cover_photo')->getClientOriginalExtension();
            $request->file('cover_photo')->move($destinationDirectory, $filename);
            $data['cover_photo'] = $this->coverPhotoDirectory . '/' . $filename;
        }

        Program::create($data);

        return redirect()->route('admin.programs.index')->with('success', 'Programme created successfully.');
    }

    public function edit(Program $program)
    {
        return Inertia::render('Admin/Programs/Edit', ['program' => $program]);
    }

    public function update(Request $request, Program $program)
    {
        $data = $request->validate([
            'slug'        => 'required|string|max:100|unique:programs,slug,' . $program->id,
            'title'       => 'required|string|max:255',
            'level'       => 'required|in:Degree,Diploma,Certificate',
            'duration'    => 'required|string|max:50',
            'short'       => 'required|string|max:500',
            'overview'    => 'required|string|max:5000',
            'modules'     => 'nullable|array',
            'modules.*'   => 'string|max:255',
            'careers'     => 'nullable|array',
            'careers.*'   => 'string|max:255',
            'entry'       => 'nullable|array',
            'entry.*'     => 'string|max:255',
            'is_active'   => 'boolean',
            'cover_photo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:10240',
        ]);

        if ($request->hasFile('cover_photo')) {
            if ($program->cover_photo && file_exists(public_path($program->cover_photo))) {
                unlink(public_path($program->cover_photo));
            }

            $destinationDirectory = public_path($this->coverPhotoDirectory);

            if (! File::isDirectory($destinationDirectory)) {
                File::makeDirectory($destinationDirectory, 0755, true);
            }

            $filename = Str::slug($data['slug']) . '_cover.' . $request->file('cover_photo')->getClientOriginalExtension();
            $request->file('cover_photo')->move($destinationDirectory, $filename);
            $data['cover_photo'] = $this->coverPhotoDirectory . '/' . $filename;
        }

        $program->update($data);

        return redirect()->route('admin.programs.index')->with('success', 'Programme updated successfully.');
    }

    public function destroy(Program $program)
    {
        if ($program->cover_photo && file_exists(public_path($program->cover_photo))) {
            unlink(public_path($program->cover_photo));
        }
        $program->delete();

        return redirect()->route('admin.programs.index')->with('success', 'Programme deleted.');
    }
}
