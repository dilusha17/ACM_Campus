<?php

namespace App\Mail;

use App\Models\ScholarshipApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ScholarshipStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public ScholarshipApplication $application,
        public string $newStatus,
    ) {}

    public function envelope(): Envelope
    {
        $subjects = [
            'reviewed' => 'Your Scholarship Application is Under Review — ACM Campus',
            'approved' => 'Congratulations! Your Scholarship Application has been Approved — ACM Campus',
            'rejected' => 'Update on Your Scholarship Application — ACM Campus',
            'pending'  => 'Update on Your Scholarship Application — ACM Campus',
        ];

        return new Envelope(
            subject: $subjects[$this->newStatus] ?? 'Update on Your Scholarship Application — ACM Campus',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.scholarship-status',
        );
    }
}
