@echo off
set PROJECT_PATH=E:\angular\cri\cri
set COMPILED_PATH=%PROJECT_PATH%\android\app\build\outputs\apk\debug

REM Compile l'application en mode production
ionic build --prod
if %ERRORLEVEL% neq 0 (
    echo "Erreur lors de la construction de l'application."
    exit /b 1
)

REM Synchronisation avec Capacitor Android
ionic cap sync android
if %ERRORLEVEL% neq 0 (
    echo "Erreur lors de la synchronisation avec Capacitor."
    exit /b 1
)

REM Build Capacitor Android
ionic cap build android --no-open --prod --release
if %ERRORLEVEL% neq 0 (
    echo "Erreur lors du build Android Capacitor."
    exit /b 1
)

REM Synchronisation avec Capacitor npx
npx cap sync android
if %ERRORLEVEL% neq 0 (
    echo "Erreur lors du build Android Capacitor."
    exit /b 1
)

REM Build Capacitor npx
npx cap open android
if %ERRORLEVEL% neq 0 (
    echo "Erreur lors du build Android Capacitor."
    exit /b 1
)
