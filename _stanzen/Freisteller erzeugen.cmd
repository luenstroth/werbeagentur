@echo off
rem Doppelklick genuegt. Ruft das PowerShell-Skript im selben Ordner auf.
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Freisteller-erzeugen.ps1"
