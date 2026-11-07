$path = 'F:\24\company\webs\agency\luenstroth-werbeagentur\src\css\main.css'
$c = Get-Content -Path $path -Raw -Encoding UTF8
$c = $c -replace '--wine-rgb', '--accent-rgb'
$c = $c -replace '--wine-light', '--accent-light'
$c = $c -replace '--wine(?!-)', '--accent'
$c = $c -replace '132,30,42', '13,79,92'
$c = $c -replace '#841E2A', '#0D4F5C'
$c = $c -replace '#A83744', '#1B7A8C'
[System.IO.File]::WriteAllText($path, $c, [System.Text.Encoding]::UTF8)
Write-Host "Fertig"
