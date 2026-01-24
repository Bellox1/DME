<!DOCTYPE html>
<html>
<head>
    <title>Connexion DME</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Bonjour,</h2>
    <p>Vous avez demandé à vous connecter à votre espace DME.</p>
    <p>Voici votre jeton d'accès sécurisé (valable pour cette session) :</p>
    
    <div style="background: #f4f4f4; padding: 15px; border: 1px solid #ddd; word-break: break-all; font-family: monospace;">
        {{ $token }}
    </div>

    <p>Conformément à vos paramètres de sécurité, ce jeton a été généré avec un secret de 256 caractères.</p>
    <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
    <br>
    <p>L'équipe technique DME</p>
</body>
</html>