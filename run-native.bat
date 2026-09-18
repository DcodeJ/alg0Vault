@echo off
cd /d "%~dp0"
dotnet build AlgorithmVault.csproj -c Release --nologo
if errorlevel 1 pause & exit /b 1
dotnet "bin\Release\net10.0-windows\alg0Vault.dll"
