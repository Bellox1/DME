<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Ordonnance - {{ $consultation->id }}</title>
    <style>
        @page { margin: 1cm; }
        body { font-family: 'DejaVu Sans', sans-serif; color: #000; line-height: 1.4; font-size: 14px; margin: 0; padding: 20px; border: 1px solid #000; height: auto; }
        
        .center { text-align: center; }
        .bold { font-weight: bold; }
        
        /* En-tête Centré */
        .main-header { margin-bottom: 20px; }
        .main-header h1 { font-size: 28px; margin-bottom: 5px; font-weight: bold; }
        .doctor-box { font-size: 16px; line-height: 1.3; }
        .doctor-box .specialty { font-weight: bold; }
        
        .divider { border: 0; border-top: 1.5px solid #000; margin: 10px 0; }
        
        /* Infos Patient */
        .info-section { margin-left: 20px; line-height: 1.6; margin-top: 10px; }
        .info-section div { margin-bottom: 3px; }
        
        /* Prescriptions */
        .prescriptions-list { margin-top: 25px; margin-left: 20px; min-height: 250px; }
        .med-item { margin-bottom: 15px; }
        
        /* Signature */
        .signature-box { margin-top: 30px; text-align: right; padding-right: 60px; }
    </style>
</head>
<body>
    <div class="main-header center">
        <h1>Ordonnance Médicale</h1>

        <div class="doctor-box">
            Dr. {{ $consultation->medecin->nom }} {{ $consultation->medecin->prenom }}<br>
            <span class="specialty">Médecine Générale</span><br>
            Date: {{ \Carbon\Carbon::parse($consultation->dateH_visite)->format('d/m/Y') }}
        </div>
    </div>

    <hr class="divider">

    <div class="info-section">
        <div>- Nom et prénom du patient : <span class="bold">{{ $consultation->patient->nom_complet }}</span></div>
        <div>- Date de naissance : <span class="bold">
            @if($consultation->patient->utilisateur && $consultation->patient->utilisateur->date_naissance)
                {{ \Carbon\Carbon::parse($consultation->patient->utilisateur->date_naissance)->age }} ans
            @else
                .........
            @endif
        </span></div>
    </div>

    <hr class="divider">

    <div class="prescriptions-list">
        @foreach($consultation->prescriptions as $index => $p)
            <div class="med-item">
                <span class="bold">{{ $index + 1 }}- {{ $p->nom_medicament }}</span> ____________________ {{ $p->dosage }}
                <div style="margin-left: 40px;">{{ $p->instructions }} ____________________</div>
            </div>
        @endforeach
    </div>

    <div class="signature-box">
        @if($consultation->signature)
            <div style="margin-bottom: 5px;">
                <img src="{{ $consultation->signature }}" style="width: 200px; height: auto; max-height: 80px;" alt="Signature">
            </div>
        @else
            <div style="margin-bottom: 5px; height: 60px;"></div>
        @endif
        <div class="bold">Signature et cachet</div>
    </div>
</body>
</html>
