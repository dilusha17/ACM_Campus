<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admission;
use App\Models\Certificate;
use App\Models\Nationality;
use App\Models\Program;
use App\Models\StudentProgram;
use App\Models\VerifiedStudent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Shared\Date as SpreadsheetDate;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = VerifiedStudent::with('studentPrograms')->latest();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('full_name', 'like', '%' . $request->search . '%')
                  ->orWhere('student_id', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('status')) {
            $query->whereHas('studentPrograms', fn($q) => $q->where('status', $request->status));
        }

        if ($request->filled('programme')) {
            $query->whereHas('studentPrograms', fn($q) => $q->where('program_slug', $request->programme));
        }

        return Inertia::render('Admin/Students/Index', [
            'students'    => $query->paginate(15)->withQueryString(),
            'filters'     => $request->only(['status', 'search', 'programme']),
            'total_count' => VerifiedStudent::count(),
            'programs'    => Program::where('is_active', true)->orderBy('title')->get(['slug', 'title']),
        ]);
    }

    public function create()
    {
        $year    = date('Y');
        $prefix  = 'ACM-' . $year . '-';
        $last    = VerifiedStudent::where('student_id', 'like', $prefix . '%')
            ->orderByDesc('student_id')
            ->value('student_id');
        $seq     = $last ? ((int) substr($last, strlen($prefix))) + 1 : 1;
        $nextId  = $prefix . str_pad($seq, 5, '0', STR_PAD_LEFT);

        $certs = Certificate::whereDoesntHave('studentProgram')
            ->where('status', 'active')
            ->orderBy('program_slug')
            ->orderBy('certificate_number')
            ->get(['id', 'certificate_number', 'program_slug']);

        return Inertia::render('Admin/Students/Create', [
            'nationalities'          => Nationality::orderBy('name')->get(['id', 'name']),
            'programs'               => \App\Models\Program::where('is_active', true)->orderBy('title')->get(['id', 'slug', 'title', 'level']),
            'next_student_id'        => $nextId,
            'available_certificates' => $certs->groupBy('program_slug')->map(fn ($g) => $g->values()),
        ]);
    }

    public function store(Request $request)
    {
        // Determine unique rule based on id_type
        $idType = $request->input('id_type', 'NIC');
        $idUniqueRule = $idType === 'Passport'
            ? 'required|string|max:20|unique:verified_students,passport'
            : 'required|string|max:20|unique:verified_students,nic';

        $data = $request->validate([
            'id_type'            => 'required|in:NIC,Passport',
            'id_number'          => $idUniqueRule,
            'first_name'         => 'required|string|max:100',
            'last_name'          => 'required|string|max:100',
            'full_name'          => 'required|string|max:255',
            'date_of_birth'      => 'required|date',
            'email'              => 'required|email|max:255|unique:verified_students,email',
            'nationality_id'     => 'required|exists:nationalities,id',
            'gender'             => 'required|in:male,female,not_stated',
            'phone_country_code' => 'required|string|max:15',
            'phone'              => 'required|string|max:30',
            'address'            => 'nullable|string|max:500',
            'program_slug'       => 'required|string|max:100',
            'enrollment_date'    => 'required|date',
            'graduation_date'    => 'nullable|date|required_if:status,graduated',
            'suspended_date'     => 'nullable|date|required_if:status,suspended',
            'status'             => 'required|in:active,graduated,suspended',
            'certificate_id'     => 'nullable|exists:programs_certificates,id',
            'image'              => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        // Auto-generate student ID
        $year   = date('Y');
        $prefix = 'ACM-' . $year . '-';
        $last   = VerifiedStudent::where('student_id', 'like', $prefix . '%')
            ->lockForUpdate()
            ->orderByDesc('student_id')
            ->value('student_id');
        $seq      = $last ? ((int) substr($last, strlen($prefix))) + 1 : 1;
        $studentId = $prefix . str_pad($seq, 5, '0', STR_PAD_LEFT);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $nameSlug  = Str::slug($data['full_name']);
            $filename  = $studentId . '_' . $nameSlug . '.' . $request->file('image')->getClientOriginalExtension();
            $request->file('image')->move(public_path('students'), $filename);
            $imagePath = 'students/' . $filename;
        }

        DB::transaction(function () use ($data, $imagePath, $studentId) {
            $student = VerifiedStudent::create([
                'student_id'         => $studentId,
                'nic'                => $data['id_type'] === 'NIC' ? $data['id_number'] : null,
                'passport'           => $data['id_type'] === 'Passport' ? $data['id_number'] : null,
                'first_name'         => $data['first_name'],
                'last_name'          => $data['last_name'],
                'full_name'          => $data['full_name'],
                'date_of_birth'      => $data['date_of_birth'],
                'email'              => $data['email'],
                'nationality_id'     => $data['nationality_id'],
                'gender'             => $data['gender'],
                'phone_country_code' => $data['phone_country_code'],
                'phone'              => $data['phone'],
                'address'            => $data['address'],
                'image_path'         => $imagePath,
            ]);

            $sp = StudentProgram::create([
                'verified_student_id' => $student->id,
                'program_slug'        => $data['program_slug'],
                'enrollment_date'     => $data['enrollment_date'],
                'graduation_date'     => $data['graduation_date'] ?? null,
                'suspended_date'      => $data['suspended_date'] ?? null,
                'status'              => $data['status'],
            ]);

            // Assign certificate if provided
            if (!empty($data['certificate_id'])) {
                $sp->update(['certificate_id' => $data['certificate_id']]);
            }
        });

        return redirect()->route('admin.students.index')->with('success', 'Student added successfully.');
    }

    public function show(VerifiedStudent $student)
    {
        return Inertia::render('Admin/Students/Show', [
            'student' => $student->load(['admission', 'studentPrograms']),
        ]);
    }

    public function edit(VerifiedStudent $student)
    {
        $student->load(['studentPrograms.certificate', 'studentPrograms.program']);

        $availableCerts = Certificate::whereDoesntHave('studentProgram')
            ->where('status', 'active')
            ->orderBy('certificate_number')
            ->get(['id', 'certificate_number', 'program_slug'])
            ->groupBy('program_slug')
            ->map(fn ($group) => $group->values());

        return Inertia::render('Admin/Students/Edit', [
            'student'                => $student,
            'nationalities'          => Nationality::orderBy('name')->get(['id', 'name']),
            'admissions'             => Admission::where('status', 'accepted')->get(['id', 'full_name', 'email', 'program_slug']),
            'programs'               => \App\Models\Program::where('is_active', true)->orderBy('title')->get(['id', 'slug', 'title', 'level']),
            'available_certificates' => $availableCerts,
        ]);
    }

    public function update(Request $request, VerifiedStudent $student)
    {
        $idType = $request->input('id_type', 'NIC');
        $idUniqueRule = $idType === 'Passport'
            ? ['required', 'string', 'max:20', 'unique:verified_students,passport,' . $student->id]
            : ['required', 'string', 'max:20', 'unique:verified_students,nic,' . $student->id];

        $data = $request->validate([
            'student_id'         => ['required', 'string', 'max:50', 'regex:/^ACM-\d{4}-\d{5}$/', 'unique:verified_students,student_id,' . $student->id],
            'id_type'            => 'required|in:NIC,Passport',
            'id_number'          => $idUniqueRule,
            'first_name'         => 'required|string|max:100',
            'last_name'          => 'required|string|max:100',
            'full_name'          => 'required|string|max:255',
            'date_of_birth'      => 'required|date',
            'email'              => ['required', 'email', 'max:255', 'unique:verified_students,email,' . $student->id],
            'nationality_id'     => 'required|exists:nationalities,id',
            'gender'             => 'required|in:male,female,not_stated',
            'phone_country_code' => 'required|string|max:15',
            'phone'              => ['required', 'string', 'regex:/^\d{9,10}$/'],
            'address'            => 'required|string|max:1000',
            'image'              => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        if ($request->hasFile('image')) {
            if ($student->image_path && file_exists(public_path($student->image_path))) {
                unlink(public_path($student->image_path));
            }
            $nameSlug  = Str::slug($data['full_name']);
            $filename  = $data['student_id'] . '_' . $nameSlug . '.' . $request->file('image')->getClientOriginalExtension();
            $request->file('image')->move(public_path('students'), $filename);
            $data['image_path'] = 'students/' . $filename;
        }

        $student->update([
            'student_id'         => $data['student_id'],
            'nic'                => $data['id_type'] === 'NIC' ? $data['id_number'] : null,
            'passport'           => $data['id_type'] === 'Passport' ? $data['id_number'] : null,
            'first_name'         => $data['first_name'],
            'last_name'          => $data['last_name'],
            'full_name'          => $data['full_name'],
            'date_of_birth'      => $data['date_of_birth'],
            'email'              => $data['email'],
            'nationality_id'     => $data['nationality_id'],
            'gender'             => $data['gender'],
            'phone_country_code' => $data['phone_country_code'],
            'phone'              => $data['phone'],
            'address'            => $data['address'],
            'image_path'         => $data['image_path'] ?? $student->image_path,
        ]);

        return back()->with('success', 'Student updated successfully.');
    }

    public function destroy(VerifiedStudent $student)
    {
        if ($student->image_path && file_exists(public_path($student->image_path))) {
            unlink(public_path($student->image_path));
        }
        $student->delete();

        return redirect()->route('admin.students.index')->with('success', 'Student removed.');
    }

    // ── Export ─────────────────────────────────────────────────────────────

    public function export(Request $request)
    {
        $query = VerifiedStudent::with(['studentPrograms.certificate', 'nationality'])->latest();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('full_name', 'like', '%' . $request->search . '%')
                  ->orWhere('student_id', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }
        if ($request->filled('status')) {
            $query->whereHas('studentPrograms', fn($q) => $q->where('status', $request->status));
        }
        if ($request->filled('programme')) {
            $query->whereHas('studentPrograms', fn($q) => $q->where('program_slug', $request->programme));
        }

        $students = $query->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $headers = [
            'Student ID', 'ID Type', 'ID Number', 'First Name', 'Last Name', 'Full Name',
            'Email', 'Date of Birth', 'Gender', 'Nationality', 'Phone Code', 'Phone', 'Address',
            'Profile Image Path',
            'Programme', 'Enrollment Date', 'Status', 'Graduation Date', 'Suspension Date',
            'Programme Certificate',
        ];

        foreach ($headers as $col => $heading) {
            $sheet->setCellValue([$col + 1, 1], $heading);
        }

        $row = 2;
        foreach ($students as $s) {
            $programs = $s->studentPrograms;

            if ($programs->isEmpty()) {
                $sheet->setCellValue([1,  $row], $s->student_id);
                $sheet->setCellValue([2,  $row], $s->nic ? 'NIC' : ($s->passport ? 'Passport' : ''));
                $sheet->setCellValue([3,  $row], $s->nic ?? $s->passport ?? '');
                $sheet->setCellValue([4,  $row], $s->first_name ?? '');
                $sheet->setCellValue([5,  $row], $s->last_name ?? '');
                $sheet->setCellValue([6,  $row], $s->full_name);
                $sheet->setCellValue([7,  $row], $s->email);
                if ($s->date_of_birth) {
                    $sheet->getCell([8, $row])->setValue(SpreadsheetDate::PHPToExcel(new \DateTime($s->date_of_birth)));
                    $sheet->getStyle([8, $row])->getNumberFormat()->setFormatCode('YYYY-MM-DD');
                }
                $sheet->setCellValue([9,  $row], $s->gender ?? '');
                $sheet->setCellValue([10, $row], $s->nationality?->name ?? '');
                $sheet->getCell([11, $row])->setValueExplicit($s->phone_country_code ?? '', DataType::TYPE_STRING);
                $sheet->setCellValue([12, $row], $s->phone ?? '');
                $sheet->setCellValue([13, $row], $s->address ?? '');
                $sheet->setCellValue([14, $row], $s->image_path ?? '');
                $row++;
                continue;
            }

            $isFirst = true;
            foreach ($programs as $sp) {
                if ($isFirst) {
                    $sheet->setCellValue([1,  $row], $s->student_id);
                    $sheet->setCellValue([2,  $row], $s->nic ? 'NIC' : ($s->passport ? 'Passport' : ''));
                    $sheet->setCellValue([3,  $row], $s->nic ?? $s->passport ?? '');
                    $sheet->setCellValue([4,  $row], $s->first_name ?? '');
                    $sheet->setCellValue([5,  $row], $s->last_name ?? '');
                    $sheet->setCellValue([6,  $row], $s->full_name);
                    $sheet->setCellValue([7,  $row], $s->email);
                    if ($s->date_of_birth) {
                        $sheet->getCell([8, $row])->setValue(SpreadsheetDate::PHPToExcel(new \DateTime($s->date_of_birth)));
                        $sheet->getStyle([8, $row])->getNumberFormat()->setFormatCode('YYYY-MM-DD');
                    }
                    $sheet->setCellValue([9,  $row], $s->gender ?? '');
                    $sheet->setCellValue([10, $row], $s->nationality?->name ?? '');
                    $sheet->getCell([11, $row])->setValueExplicit($s->phone_country_code ?? '', DataType::TYPE_STRING);
                    $sheet->setCellValue([12, $row], $s->phone ?? '');
                    $sheet->setCellValue([13, $row], $s->address ?? '');
                    $sheet->setCellValue([14, $row], $s->image_path ?? '');
                    $isFirst = false;
                }
                $sheet->setCellValue([15, $row], $sp->program_slug ?? '');
                $sheet->setCellValue([16, $row], $sp->enrollment_date ?? '');
                $sheet->setCellValue([17, $row], $sp->status ?? '');
                $sheet->setCellValue([18, $row], $sp->graduation_date ?? '');
                $sheet->setCellValue([19, $row], $sp->suspended_date ?? '');
                $sheet->setCellValue([20, $row], ($sp->status === 'graduated' && $sp->certificate) ? $sp->certificate->certificate_number : '');
                $row++;
            }
        }

        $writer = new Xlsx($spreadsheet);
        $filename = 'students_' . date('Y-m-d') . '.xlsx';

        return response()->streamDownload(function () use ($writer) {
            $writer->save('php://output');
        }, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }

    // ── Import: parse file + check duplicates ─────────────────────────────

    public function importCheck(Request $request)
    {
        $request->validate(['file' => 'required|file|mimes:xlsx,xls,csv|max:10240']);

        $expectedColumns = [
            'Student ID', 'ID Type', 'ID Number', 'First Name', 'Last Name', 'Full Name',
            'Email', 'Date of Birth', 'Gender', 'Nationality', 'Phone Code', 'Phone', 'Address',
            'Profile Image Path',
            'Programme', 'Enrollment Date', 'Status', 'Graduation Date', 'Suspension Date',
            'Programme Certificate',
        ];

        $spreadsheet = IOFactory::load($request->file('file')->getRealPath());
        $sheet       = $spreadsheet->getActiveSheet();

        // Read headers from row 1
        $colCount = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString(
            $sheet->getHighestDataColumn(1)
        );
        $headers = [];
        for ($c = 1; $c <= $colCount; $c++) {
            $h = trim((string) $sheet->getCell([$c, 1])->getValue());
            if ($h !== '') {
                $headers[] = $h;
            }
        }

        $missing = array_values(array_diff($expectedColumns, $headers));
        $extra   = array_values(array_diff($headers, $expectedColumns));

        if (!empty($missing) || !empty($extra)) {
            $msg = 'Column mismatch.';
            if (!empty($missing)) $msg .= ' Missing: ' . implode(', ', $missing) . '.';
            if (!empty($extra))   $msg .= ' Unexpected: ' . implode(', ', $extra) . '.';
            return response()->json(['column_error' => $msg]);
        }

        // Map header name → 1-based column index
        $headerIndex = array_flip($headers); // value is 0-based, so +1 below
        $rowCount    = $sheet->getHighestDataRow();

        // Read data rows
        $rows = [];
        for ($r = 2; $r <= $rowCount; $r++) {
            $rowData = [];
            $hasData = false;
            foreach ($expectedColumns as $col) {
                $colIdx = ($headerIndex[$col] ?? -1) + 1;
                if ($colIdx < 1) {
                    $rowData[$col] = '';
                    continue;
                }
                $cell = $sheet->getCell([$colIdx, $r]);
                // Date-formatted cells (e.g. Date of Birth) come back as Excel serial floats;
                // convert them to Y-m-d strings so the rest of the pipeline stays consistent.
                if (SpreadsheetDate::isDateTime($cell) && is_numeric($cell->getValue())) {
                    $val = SpreadsheetDate::excelToDateTimeObject($cell->getValue())->format('Y-m-d');
                } else {
                    $val = trim((string) $cell->getValue());
                }
                $rowData[$col] = $val;
                if ($val !== '') $hasData = true;
            }
            if ($hasData) {
                $rows[] = $rowData;
            }
        }

        if (empty($rows)) {
            return response()->json(['column_error' => 'The file contains no data rows.']);
        }

        // Group continuation rows (student fields blank) with their parent row
        $groups = [];
        foreach ($rows as $row) {
            $isContinuation = trim($row['Student ID'] ?? '') === ''
                           && trim($row['Email'] ?? '') === ''
                           && trim($row['Full Name'] ?? '') === '';

            if (!$isContinuation) {
                $groups[] = ['header' => $row, 'continuations' => []];
            } elseif (!empty($groups)) {
                $groups[count($groups) - 1]['continuations'][] = $row;
            }
        }

        $toImport = []; // rows for brand-new students
        $toUpdate = []; // rows for existing students that have a new programme
        $skipped  = 0;  // exact duplicates (student + programme already exist)

        foreach ($groups as $group) {
            $header    = $group['header'];
            $studentId = trim($header['Student ID'] ?? '');
            $idType    = trim($header['ID Type'] ?? '');
            $idNumber  = trim($header['ID Number'] ?? '');
            $email     = trim($header['Email'] ?? '');

            // Find existing student
            $existing = null;
            if ($studentId) {
                $existing = VerifiedStudent::where('student_id', $studentId)->first();
            }
            if (!$existing && $idNumber) {
                if ($idType === 'NIC') {
                    $existing = VerifiedStudent::where('nic', $idNumber)->first();
                } elseif ($idType === 'Passport') {
                    $existing = VerifiedStudent::where('passport', $idNumber)->first();
                }
            }
            if (!$existing && $email) {
                $existing = VerifiedStudent::where('email', $email)->first();
            }

            if (!$existing) {
                // New student — queue all rows in this group
                $toImport[] = $header;
                foreach ($group['continuations'] as $cont) {
                    $toImport[] = $cont;
                }
            } else {
                // Student already exists — check each programme row individually
                $allRows = array_merge([$header], $group['continuations']);
                foreach ($allRows as $progRow) {
                    $programSlug = trim($progRow['Programme'] ?? '');
                    if (!$programSlug) {
                        $skipped++;
                        continue;
                    }

                    $existingSp = StudentProgram::with('certificate')
                        ->where('verified_student_id', $existing->id)
                        ->where('program_slug', $programSlug)
                        ->first();

                    if (!$existingSp) {
                        // New programme for this existing student
                        $progRow['_existing_student_id'] = $existing->id;
                        $progRow['_existing_sp_id']       = null;
                        $toUpdate[] = $progRow;
                    } else {
                        // Programme already exists — compare all fields to detect changes
                        $importEnrollment = trim($progRow['Enrollment Date'] ?? '') ?: null;
                        $importStatus     = trim($progRow['Status'] ?? 'active');
                        $importGraduation = trim($progRow['Graduation Date'] ?? '') ?: null;
                        $importSuspension = trim($progRow['Suspension Date'] ?? '') ?: null;
                        $importCertNum    = trim($progRow['Programme Certificate'] ?? '');

                        $dbEnrollment = $existingSp->enrollment_date?->format('Y-m-d');
                        $dbGraduation = $existingSp->graduation_date?->format('Y-m-d');
                        $dbSuspension = $existingSp->suspended_date?->format('Y-m-d');
                        $dbCertNum    = $existingSp->certificate?->certificate_number ?? '';

                        $normEnrollment = $importEnrollment ? date('Y-m-d', strtotime($importEnrollment)) : null;
                        $normGraduation = $importGraduation ? date('Y-m-d', strtotime($importGraduation)) : null;
                        $normSuspension = $importSuspension ? date('Y-m-d', strtotime($importSuspension)) : null;

                        $identical = $dbEnrollment === $normEnrollment
                                  && $existingSp->status === $importStatus
                                  && $dbGraduation === $normGraduation
                                  && $dbSuspension === $normSuspension
                                  && $dbCertNum    === $importCertNum;

                        if ($identical) {
                            $skipped++;
                        } else {
                            // Programme changed — queue for update
                            $progRow['_existing_student_id'] = $existing->id;
                            $progRow['_existing_sp_id']       = $existingSp->id;
                            $toUpdate[] = $progRow;
                        }
                    }
                }
            }
        }

        return response()->json(['to_import' => $toImport, 'to_update' => $toUpdate, 'skipped' => $skipped]);
    }

    // ── Import: confirm ───────────────────────────────────────────────────

    public function importConfirm(Request $request)
    {
        $rows       = $request->input('rows', []);
        $updateRows = $request->input('update_rows', []);
        $imported   = 0;
        $updated    = 0;

        DB::transaction(function () use ($rows, $updateRows, &$imported, &$updated) {
            // ── New students ──────────────────────────────────────────────
            $lastStudent = null;

            foreach ($rows as $row) {
                // Continuation row: all student-identity fields are blank
                $isContinuation = trim($row['Student ID'] ?? '') === ''
                               && trim($row['Email'] ?? '') === ''
                               && trim($row['Full Name'] ?? '') === '';

                if (!$isContinuation) {
                    // ── Create a new student ───────────────────────────────
                    $year   = date('Y');
                    $prefix = 'ACM-' . $year . '-';

                    $studentId = trim($row['Student ID'] ?? '');
                    if (!$studentId || !preg_match('/^ACM-\d{4}-\d{5}$/', $studentId)) {
                        $last = VerifiedStudent::where('student_id', 'like', $prefix . '%')
                            ->lockForUpdate()
                            ->orderByDesc('student_id')
                            ->value('student_id');
                        $seq = $last ? ((int) substr($last, strlen($prefix))) + 1 : 1;
                        $studentId = $prefix . str_pad($seq, 5, '0', STR_PAD_LEFT);
                    }

                    $idType   = trim($row['ID Type'] ?? '');
                    $idNumber = trim($row['ID Number'] ?? '');

                    $nationalityId   = null;
                    $nationalityName = trim($row['Nationality'] ?? '');
                    if ($nationalityName) {
                        $nat = Nationality::where('name', $nationalityName)->first();
                        $nationalityId = $nat?->id;
                    }

                    // Normalise phone country code: Excel strips the leading '+' from values
                    // like "+94", storing them as the number 94. Re-add it when missing.
                    $rawCode = trim($row['Phone Code'] ?? '');
                    if ($rawCode !== '' && !str_starts_with($rawCode, '+') && ctype_digit($rawCode)) {
                        $rawCode = '+' . $rawCode;
                    }
                    $phoneCode = $rawCode ?: null;

                    $lastStudent = VerifiedStudent::create([
                        'student_id'         => $studentId,
                        'nic'                => $idType === 'NIC' ? $idNumber : null,
                        'passport'           => $idType === 'Passport' ? $idNumber : null,
                        'first_name'         => trim($row['First Name'] ?? '') ?: null,
                        'last_name'          => trim($row['Last Name'] ?? '') ?: null,
                        'full_name'          => trim($row['Full Name'] ?? ''),
                        'date_of_birth'      => trim($row['Date of Birth'] ?? '') ?: null,
                        'email'              => trim($row['Email'] ?? ''),
                        'gender'             => in_array(trim($row['Gender'] ?? ''), ['male', 'female', 'not_stated']) ? trim($row['Gender']) : 'not_stated',
                        'nationality_id'     => $nationalityId,
                        'phone_country_code' => $phoneCode,
                        'phone'              => trim($row['Phone'] ?? '') ?: null,
                        'address'            => trim($row['Address'] ?? '') ?: null,
                        'image_path'         => trim($row['Profile Image Path'] ?? '') ?: null,
                    ]);

                    $imported++;
                }

                // ── Create programme for this row (header or continuation) ──
                if ($lastStudent) {
                    $programSlug    = trim($row['Programme'] ?? '');
                    $enrollmentDate = trim($row['Enrollment Date'] ?? '');
                    $status         = trim($row['Status'] ?? 'active');
                    $graduationDate = trim($row['Graduation Date'] ?? '') ?: null;
                    $suspensionDate = trim($row['Suspension Date'] ?? '') ?: null;

                    if ($programSlug && $enrollmentDate) {
                        $sp = StudentProgram::create([
                            'verified_student_id' => $lastStudent->id,
                            'program_slug'        => $programSlug,
                            'enrollment_date'     => $enrollmentDate,
                            'graduation_date'     => $graduationDate,
                            'suspended_date'      => $suspensionDate,
                            'status'              => in_array($status, ['active', 'graduated', 'suspended']) ? $status : 'active',
                        ]);

                        if ($sp->status === 'graduated') {
                            $certNum = trim($row['Programme Certificate'] ?? '');
                            if ($certNum) {
                                $cert = Certificate::where('certificate_number', $certNum)->first();
                                if ($cert) {
                                    $sp->update(['certificate_id' => $cert->id]);
                                }
                            }
                        }
                    }
                }
            }

            // ── Existing students — add new programmes or update changed ones ──
            foreach ($updateRows as $row) {
                $existingStudentId = (int) ($row['_existing_student_id'] ?? 0);
                if (!$existingStudentId) continue;

                $existingSpId   = isset($row['_existing_sp_id']) && $row['_existing_sp_id'] !== null
                                    ? (int) $row['_existing_sp_id']
                                    : null;
                $programSlug    = trim($row['Programme'] ?? '');
                $enrollmentDate = trim($row['Enrollment Date'] ?? '');
                $status         = trim($row['Status'] ?? 'active');
                $graduationDate = trim($row['Graduation Date'] ?? '') ?: null;
                $suspensionDate = trim($row['Suspension Date'] ?? '') ?: null;
                $validStatus    = in_array($status, ['active', 'graduated', 'suspended']) ? $status : 'active';
                $certNum        = trim($row['Programme Certificate'] ?? '');

                if (!$programSlug || !$enrollmentDate) continue;

                if ($existingSpId) {
                    // Update the existing programme record
                    $sp = StudentProgram::find($existingSpId);
                    if ($sp) {
                        $sp->update([
                            'enrollment_date' => $enrollmentDate,
                            'graduation_date' => $graduationDate,
                            'suspended_date'  => $suspensionDate,
                            'status'          => $validStatus,
                        ]);
                        if ($validStatus === 'graduated' && $certNum) {
                            $cert = Certificate::where('certificate_number', $certNum)->first();
                            if ($cert) $sp->update(['certificate_id' => $cert->id]);
                        }
                        $updated++;
                    }
                } else {
                    // New programme for existing student
                    $sp = StudentProgram::create([
                        'verified_student_id' => $existingStudentId,
                        'program_slug'        => $programSlug,
                        'enrollment_date'     => $enrollmentDate,
                        'graduation_date'     => $graduationDate,
                        'suspended_date'      => $suspensionDate,
                        'status'              => $validStatus,
                    ]);
                    if ($sp->status === 'graduated' && $certNum) {
                        $cert = Certificate::where('certificate_number', $certNum)->first();
                        if ($cert) $sp->update(['certificate_id' => $cert->id]);
                    }
                    $updated++;
                }
            }
        });

        return response()->json(['imported' => $imported, 'updated' => $updated]);
    }
}
