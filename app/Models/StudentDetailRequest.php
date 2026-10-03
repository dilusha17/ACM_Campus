<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class StudentDetailRequest extends Model
{
    public const VALID_DAYS = 30;

    protected $fillable = [
        'token',
        'admission_id',
        'scholarship_application_id',
        'program_id',
        'full_name',
        'email',
        'expires_at',
        'submitted_at',
        'id_type',
        'id_number',
        'date_of_birth',
        'nationality_id',
        'gender',
        'country_code_id',
        'phone',
        'address',
        'image_path',
        'verified_student_id',
    ];

    protected function casts(): array
    {
        return [
            'expires_at'    => 'datetime',
            'submitted_at'  => 'datetime',
            'date_of_birth' => 'date',
        ];
    }

    /**
     * Get (or create) the open request for an accepted admission / approved scholarship.
     */
    public static function issueFor(Admission|ScholarshipApplication $source): self
    {
        $column = $source instanceof Admission ? 'admission_id' : 'scholarship_application_id';

        $existing = static::where($column, $source->id)
            ->whereNull('submitted_at')
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if ($existing) {
            return $existing;
        }

        return static::create([
            $column      => $source->id,
            'token'      => Str::random(64),
            'program_id' => $source->program_id,
            'full_name'  => $source->full_name,
            'email'      => $source->email,
            'expires_at' => now()->addDays(self::VALID_DAYS),
        ]);
    }

    public function url(): string
    {
        return route('student-details.show', $this->token);
    }

    public function isSubmitted(): bool
    {
        return $this->submitted_at !== null;
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Shape used by the admin screens to prefill the Create Student form.
     */
    public static function adminPayload(?self $request): ?array
    {
        if (! $request) {
            return null;
        }

        return [
            'id'               => $request->id,
            'submitted'        => $request->isSubmitted(),
            'expired'          => ! $request->isSubmitted() && $request->isExpired(),
            'expires_at'       => $request->expires_at->toDateString(),
            'already_enrolled' => $request->verified_student_id !== null,
            'values'           => $request->isSubmitted() ? [
                'id_type'            => $request->id_type,
                'id_number'          => $request->id_number,
                'date_of_birth'      => $request->date_of_birth?->toDateString(),
                'nationality_id'     => $request->nationality_id ? (string) $request->nationality_id : '',
                'gender'             => $request->gender,
                'phone_country_code' => $request->countryCode?->dial_code ?? '',
                'phone'              => $request->phone,
                'address'            => $request->address,
            ] : null,
            'image_url'        => $request->isSubmitted() && $request->image_path ? '/' . $request->image_path : null,
        ];
    }

    public function sourceLabel(): string
    {
        if ($this->admission_id) {
            return 'Admission application #' . $this->admission_id;
        }

        if ($this->scholarship_application_id) {
            $scheme = $this->scholarshipApplication?->scheme;

            return 'Scholarship application #' . $this->scholarship_application_id . ($scheme ? " ({$scheme})" : '');
        }

        return 'Application';
    }

    public function adminUrl(): ?string
    {
        return match (true) {
            (bool) $this->admission_id               => route('admin.admissions.show', $this->admission_id),
            (bool) $this->scholarship_application_id => route('admin.scholarships.show', $this->scholarship_application_id),
            default                                  => null,
        };
    }

    public function scholarshipApplication()
    {
        return $this->belongsTo(ScholarshipApplication::class);
    }

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    public function countryCode()
    {
        return $this->belongsTo(CountryCode::class);
    }
}
