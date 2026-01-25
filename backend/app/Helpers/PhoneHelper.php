<?php

namespace App\Helpers;

class PhoneHelper
{
    /**
     * Formats a phone number according to Benin specific rules (+229 01...).
     * Only for Standard Phone (tel).
     */
    public static function formatBeninTel(?string $number): ?string
    {
        if (empty($number)) return null;

        $clean = preg_replace('/\s+/', '', $number);

        if (str_starts_with($clean, '+') && !str_starts_with($clean, '+229')) {
            return $clean;
        }

        if (str_starts_with($clean, '+229')) {
            $suffix = substr($clean, 4);
        } else {
            $suffix = $clean;
        }

        // Force '01' ONLY for standard tel
        if (!str_starts_with($suffix, '01')) {
            $suffix = '01' . $suffix;
        }

        return '+229' . $suffix;
    }

    /**
     * Formats a WhatsApp number (clean + international prefix).
     * Does NOT force '01' because WhatsApp numbers can vary.
     */
    public static function formatBeninWhatsApp(?string $number): ?string
    {
        if (empty($number)) return null;

        $clean = preg_replace('/\s+/', '', $number);

        if (str_starts_with($clean, '+')) {
            return $clean;
        }

        // Just add +229 if missing, but no prefix forcing
        return '+229' . $clean;
    }

    /**
     * Legacy/Generic formatter (for use in Twilio when we don't know the source type)
     * We'll assume the number is already formatted or follows basic international rules.
     */
    public static function formatGeneric(?string $number): ?string
    {
        if (empty($number)) return null;
        
        // On branche sur la logique béninoise par défaut pour la cohérence
        // car c'est ce qui a été injecté via les seeders/fix_formats.
        return self::formatBeninTel($number);
    }
}
