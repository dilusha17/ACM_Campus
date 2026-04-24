<?php

namespace App\Mail;

use App\Models\Admission;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdmissionStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Admission $admission,
        public string $newStatus,
    ) {}

    public function envelope(): Envelope
    {
        $subjects = [
            'reviewed' => 'Your Application is Under Review — ACM Campus',
            'accepted' => 'Congratulations! Your Application has been Accepted — ACM Campus',
            'rejected' => 'Update on Your Application — ACM Campus',
            'pending'  => 'Update on Your Application — ACM Campus',
        ];

        return new Envelope(
            subject: $subjects[$this->newStatus] ?? 'Update on Your Application — ACM Campus',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.admission-status',
        );
    }
}
