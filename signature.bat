@echo off
set PROJECT_PATH=E:\angular\cri\cri
set COMPILED_PATH=%PROJECT_PATH%\android\app\build\outputs\apk\debug

REM Zipalign
zipalign -p -f -v 4 "%COMPILED_PATH%\app-debug.apk" "%COMPILED_PATH%\app-debug_zipaligned.apk"
if %ERRORLEVEL% neq 0 (
    echo "Erreur lors du zipalign."
    exit /b 1
)

REM Signature de l'APK
apksigner sign --ks "dgsrmada.jks" --ks-key-alias dgsr-alias --in "%COMPILED_PATH%\app-debug_zipaligned.apk" --out "%COMPILED_PATH%\i-tsirika.apk"
if %ERRORLEVEL% neq 0 (
    echo "Erreur lors de la signature de l'APK."
    exit /b 1
)

echo "Build et signature terminés avec succès !"
pause