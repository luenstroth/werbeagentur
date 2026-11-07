# Freisteller aus allen EPS in diesem Ordner erzeugen.
# Voraussetzung: Adobe Illustrator ist installiert.
# Start: Doppelklick auf "Freisteller erzeugen.cmd"

$jsx = "F:\24\company\webs\agency\_altinhalt-werbeagentur\ai-freisteller.jsx"

if (-not (Test-Path $jsx)) {
  Write-Host "Skript nicht gefunden: $jsx" -ForegroundColor Red
  Read-Host "Enter zum Schliessen"; exit 1
}

Write-Host "Starte Illustrator ..." -ForegroundColor Cyan
try { $ai = New-Object -ComObject Illustrator.Application }
catch { Write-Host "Illustrator laesst sich nicht starten: $_" -ForegroundColor Red; Read-Host "Enter"; exit 1 }

# Warten, bis Illustrator wirklich antwortet. Ohne das laufen die ersten
# open()-Aufrufe ins Leere ("there is no document"), wenn die Anwendung
# durch dieses Skript erst hochgefahren wird.
Write-Host "Warte auf Bereitschaft ..." -ForegroundColor Cyan
$bereit = $false
for ($i = 1; $i -le 60; $i++) {
  try {
    $probe = $ai.DoJavaScript("app.name")
    if ($probe) { $bereit = $true; break }
  } catch { }
  Start-Sleep -Seconds 2
}
if (-not $bereit) {
  Write-Host "Illustrator antwortet nicht. Bitte Illustrator von Hand oeffnen und erneut starten." -ForegroundColor Red
  Read-Host "Enter zum Schliessen"; exit 1
}
Start-Sleep -Seconds 3

Write-Host "Verarbeite EPS-Dateien ..." -ForegroundColor Cyan
$src = Get-Content $jsx -Raw
$result = $ai.DoJavaScript($src)

Write-Host ""
Write-Host $result
Write-Host ""
if ($result -match "FEHLER") {
  Write-Host "Es gab Fehler - bitte die Meldungen oben pruefen." -ForegroundColor Yellow
} else {
  Write-Host "Fertig. Die PNG-Dateien liegen neben den EPS-Dateien (*-frei.png)." -ForegroundColor Green
}
Read-Host "Enter zum Schliessen"
