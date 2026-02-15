<?php

namespace App\Services;

use Twilio\Rest\Client;
use Illuminate\Support\Facades\Log;

class TwilioService
{
    protected $client;
    protected $sid;
    protected $token;
    protected $fromNumber;
    protected $whatsappFrom;

    // public function __construct()
    // {
    //     $this->sid = env('TWILIO_SID');
    //     $this->token = env('TWILIO_AUTH_TOKEN');
    //     $this->fromNumber = env('TWILIO_PHONE_NUMBER');
    //     // La valeur par défaut de la Sandbox est généralement +14155238886, strictement pour les tests
    //     // Ou celui fourni par l'utilisateur s'il a un expéditeur WhatsApp activé
    //     $this->whatsappFrom = env('TWILIO_WHATSAPP_NUMBER', '+14155238886'); 

    //     try {
    //         $this->client = new Client($this->sid, $this->token);
    //     } catch (\Exception $e) {
    //         Log::error("Erreur Initialisation Twilio: " . $e->getMessage());
    //     }
    // }


    public function __construct()
    {
        // On essaie de lire via config() d'abord, sinon via env()
        $this->sid = config('services.twilio.sid') ?? env('TWILIO_SID');
        $this->token = config('services.twilio.token') ?? env('TWILIO_AUTH_TOKEN');
        $this->fromNumber = config('services.twilio.from') ?? env('TWILIO_PHONE_NUMBER');
        $this->whatsappFrom = config('services.twilio.whatsapp_from') ?? env('TWILIO_WHATSAPP_NUMBER', '+14155238886'); 

        try {
            // AJOUT DE CETTE VÉRIFICATION
            if ($this->sid && $this->token) {
                $this->client = new Client($this->sid, $this->token);
            } else {
                \Illuminate\Support\Facades\Log::warning("Twilio non configuré. Les SMS ne seront pas envoyés.");
            }
        } catch (\Exception $e) {
            Log::error("Erreur Initialisation Twilio: " . $e->getMessage());
        }
    }

    public function sendSMS($to, $message)
    {
        try {
            $formattedTo = $this->formatNumber($to);
            Log::info("Tentative d'envoi SMS Twilio vers : $formattedTo");

            $response = $this->client->messages->create(
                $formattedTo,
                [
                    'from' => $this->fromNumber,
                    'body' => $message
                ]
            );
            Log::info("SMS Twilio envoyé avec succès. SID : " . $response->sid . " | Vers : $formattedTo");
            return true;
        } catch (\Exception $e) {
            Log::error("Erreur SMS Twilio vers $to : " . $e->getMessage());
            return false;
        }
    }

    public function sendWhatsApp($to, $message)
    {
        try {
            $formattedTo = 'whatsapp:' . $this->formatNumber($to);
            $from = 'whatsapp:' . $this->whatsappFrom;
            Log::info("Tentative d'envoi WhatsApp Twilio de $from vers : $formattedTo");

            $response = $this->client->messages->create(
                $formattedTo,
                [
                    'from' => $from,
                    'body' => $message
                ]
            );
            Log::info("WhatsApp Twilio envoyé avec succès. SID : " . $response->sid . " | Vers : $formattedTo");
            return true;
        } catch (\Exception $e) {
            Log::error("Erreur WhatsApp Twilio vers $to : " . $e->getMessage());
            return false;
        }
    }

    private function formatNumber($number)
    {
        return \App\Helpers\PhoneHelper::formatGeneric($number);
    }
}
