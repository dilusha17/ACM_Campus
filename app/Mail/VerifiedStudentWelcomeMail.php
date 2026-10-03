<?php

namespace App\Mail;

use App\Models\StudentProgram;
use App\Models\VerifiedStudent;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerifiedStudentWelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public VerifiedStudent $student,
        public StudentProgram $studentProgram,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to ACM Campus - Your Student Account Details',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.verified-student-welcome',
        );
    }
}