<?php

namespace App\Mail;

use App\Models\Admission;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdmissionAutoReplyMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Admission $admission) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Application to ACM Campus — Received',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.admission-auto-reply',
        );
    }
}
