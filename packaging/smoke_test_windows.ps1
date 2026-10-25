# Starts the built Windows app without a window and checks that the UI and API respond.
$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")
$exe = "dist\Super Gemini Librarian\Super Gemini Librarian.exe"
$home_dir = Join-Path ([IO.Path]::GetTempPath()) ("sgl-" + [guid]::NewGuid())
New-Item -ItemType Directory -Path $home_dir | Out-Null
$base = "http://127.0.0.1:8790"

$p = Start-Process -FilePath $exe -ArgumentList @("--no-window", "--port", "8790", "--home", "`"$home_dir`"") -PassThru
try {
  $up = $false
  for ($i = 0; $i -lt 60; $i++) {
    try { Invoke-WebRequest "$base/api/state" -UseBasicParsing | Out-Null; $up = $true; break } catch { Start-Sleep 1 }
  }
  if (-not $up) { throw "The app did not start" }
  if ((Invoke-WebRequest "$base/" -UseBasicParsing).Content -notmatch "Super Gemini Librarian") { throw "UI not served" }
  if ((Invoke-WebRequest "$base/app.js" -UseBasicParsing).Content -notmatch "KIND_EXT") { throw "app.js not served" }
  $state = (Invoke-WebRequest "$base/api/state" -UseBasicParsing).Content | ConvertFrom-Json
  if ($state.settings.platform -ne "win32") { throw "unexpected platform" }
  Invoke-WebRequest -Method POST "$base/api/quit" -UseBasicParsing | Out-Null
  if (-not $p.WaitForExit(20000)) { throw "The app did not quit" }
  Write-Host "Smoke test passed"
} finally {
  if (-not $p.HasExited) { Stop-Process -Id $p.Id -Force }
  $log = Join-Path $env:LOCALAPPDATA "Super Gemini Librarian\Super Gemini Librarian.log"
  if (Test-Path $log) { Get-Content $log -Tail 20 }
}
