<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Ordonnance</title>
    <style>
        body { font-family: sans-serif; }
        .header { text-align: center; margin-bottom: 20px; }
        .medecin-info { font-weight: bold; }
        .patient-info { margin-top: 20px; margin-bottom: 20px; }
        .prescriptions { width: 100%; border-collapse: collapse; }
        .prescriptions th, .prescriptions td { border: 1px solid #ddd; padding: 8px; }
        .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Ordonnance Médicale</h1>
        <div class="medecin-info">
            Dr. {{ $medecin->nom }} {{ $medecin->prenom }}<br>
            Médecine Générale
        </div>
        <div>Numéro: {{ $prescription->numero_ordonnance }}</div>
        <div>Date: {{ \Carbon\Carbon::parse($prescription->date_creation)->format('d/m/Y') }}</div>
    </div>

    <div class="patient-info">
        <strong>Patient:</strong>
        @if(isset($patient) && $patient)
            {{ $patient->user->nom ?? '' }} {{ $patient->user->prenom ?? '' }}
        @else
            Patient non spécifié
        @endif
        <br>
    </div>

    <h3>Prescriptions</h3>
    <table class="prescriptions">
        <thead>
            <tr>
                <th>Médicament</th>
                <th>Dosage</th>
                <th>Instructions</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ $prescription->nom_medicament }}</td>
                <td>{{ $prescription->dosage }}</td>
                <td>{{ $prescription->instructions }}</td>
            </tr>
        </tbody>
    </table>

    <div class="footer">
        DME - Dossier Médical Électronique
    </div>
</body>
</html>
