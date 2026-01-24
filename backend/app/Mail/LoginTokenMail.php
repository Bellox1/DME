<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LoginTokenMail extends Mailable
{
    use Queueable, SerializesModels;

    public $token; // Le token de 256 caractères

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Votre lien de connexion sécurisé - DME',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.login_token', // On va créer cette vue juste après
        );
    }
}