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
            Dr. {{ $consultation->medecin->nom }} {{ $consultation->medecin->prenom }}<br>
            Médecine Générale
        </div>
        <div>Date: {{ \Carbon\Carbon::parse($consultation->dateH_visite)->format('d/m/Y') }}</div>
    </div>

    <div class="patient-info">
        <strong>Patient:</strong> {{ $consultation->patient->user->nom ?? '' }} {{ $consultation->patient->user->prenom ?? '' }} (ou Enfant)<br>
        <!-- Gérer le nom du patient correctement selon la relation -->
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
            @foreach($consultation->prescriptions as $p)
            <tr>
                <td>{{ $p->nom_medicament }}</td>
                <td>{{ $p->dosage }}</td>
                <td>{{ $p->instructions }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        DME - Dossier Médical Électronique
    </div>
</body>
</html>
