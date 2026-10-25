# Builds the Windows app folder, a portable .zip and a Setup.exe installer.
# Run on Windows from the project folder:  powershell -ExecutionPolicy Bypass -File packaging\build_windows_app.ps1
$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")
$Python = if ($env:PYTHON) { $env:PYTHON } else { "python" }
$Version = if ($env:APP_VERSION) { $env:APP_VERSION } else { (Get-Content VERSION).Trim() }
$Name = "Super Gemini Librarian"

Remove-Item -Recurse -Force build, dist -ErrorAction SilentlyContinue
& $Python -m venv build\venv
& build\venv\Scripts\python -m pip install --quiet --upgrade pip
& build\venv\Scripts\python -m pip install --quiet -r packaging\requirements-app.txt
if ($LASTEXITCODE) { throw "pip install failed" }

$env:APP_VERSION = $Version
& build\venv\Scripts\pyinstaller --noconfirm --clean --distpath dist --workpath build\pyinstaller packaging\SuperGeminiLibrarian.spec
if ($LASTEXITCODE) { throw "PyInstaller failed" }

# Portable zip (unzip anywhere and run the .exe)
Compress-Archive -Path "dist\$Name" -DestinationPath "dist\Super-Gemini-Librarian-$Version-Windows-Portable.zip"

# Installer (needs Inno Setup 6: https://jrsoftware.org/isinfo.php)
$iscc = "${env:ProgramFiles(x86)}\Inno Setup 6\ISCC.exe"
if (Test-Path $iscc) {
  & $iscc "/DAppVersion=$Version" packaging\windows-installer.iss
  if ($LASTEXITCODE) { throw "Inno Setup failed" }
} else {
  Write-Warning "Inno Setup not found - skipped the installer, the portable zip is in dist\"
}
Get-ChildItem dist
