$baseUrl = "http://localhost:8001/api"

Write-Host "1. Testing Parent Registration..."
$parentBody = @{
    nom = "Dupont"
    prenom = "Jean"
    tel = "0601020304"
    mot_de_passe = "password123"
    sexe = "Homme"
    date_naissance = "1980-01-01"
    ville = "Paris"
} | ConvertTo-Json

try {
    $parentResponse = Invoke-RestMethod -Uri "$baseUrl/register" -Method Post -Body $parentBody -ContentType "application/json"
    Write-Host "Success! Created Parent ID: $($parentResponse.user.id)" -ForegroundColor Green
    $parentId = $parentResponse.user.id
} catch {
    Write-Host "Error registering parent: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host $_.ErrorDetails.Message
}

Write-Host "`n2. Testing Child Registration..."
$childBody = @{
    parent_id = $parentId
    nom = "Dupont"
    prenom = "Junior"
    sexe = "Homme"
    date_naissance = "2015-05-05"
} | ConvertTo-Json

try {
    $childResponse = Invoke-RestMethod -Uri "$baseUrl/enfants" -Method Post -Body $childBody -ContentType "application/json"
    Write-Host "Success! Created Child ID: $($childResponse.enfant.id)" -ForegroundColor Green
    $patientId = $childResponse.patient_id
} catch {
    Write-Host "Error registering child: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host $_.ErrorDetails.Message
}

Write-Host "`n3. Testing Patient List (Should see Parent + Child)..."
try {
    $patients = Invoke-RestMethod -Uri "$baseUrl/patients" -Method Get
    $patients | Format-Table id, nom, prenom, type, age -AutoSize
} catch {
    Write-Host "Error getting patients: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n4. Testing Direct RDV Creation (for Child)..."
$rdvBody = @{
    patient_id = $patientId
    medecin_id = $parentId # Hack: Using parent as medecin just to pass FK constraint if any, assuming User table is same
    dateH_rdv = "2026-02-01 10:00:00"
    motif = "Vaccination"
} | ConvertTo-Json

# Note: RDV requires medecin_id. I don't have a doctor user created.
# I will use the parent_id as medecin_id temporarily since they are both 'utilisateurs' and we didn't strictly enforce role check in controller yet.
try {
    $rdvResponse = Invoke-RestMethod -Uri "$baseUrl/rdvs" -Method Post -Body $rdvBody -ContentType "application/json"
    Write-Host "Success! Created RDV ID: $($rdvResponse.rdv.id)" -ForegroundColor Green
} catch {
    Write-Host "Error creating RDV: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host $_.ErrorDetails.Message
}
