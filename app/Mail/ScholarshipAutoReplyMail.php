<?php

namespace App\Mail;

use App\Models\ScholarshipApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ScholarshipAutoReplyMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ScholarshipApplication $application) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Scholarship Application — ACM Campus',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.scholarship-auto-reply',
        );
    }
}
