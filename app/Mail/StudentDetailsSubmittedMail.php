<?php

namespace App\Mail;

use App\Models\StudentDetailRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StudentDetailsSubmittedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public StudentDetailRequest $detailRequest) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Student Details Received — ' . $this->detailRequest->full_name,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.student-details-submitted',
        );
    }
}
