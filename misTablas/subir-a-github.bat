@echo off
chcp 65001 >nul
cls
echo ========================================================
echo       RESPALDO EN GITHUB - PLATAFORMA MIS TABLAS
echo ========================================================
echo.
echo Comprobando Git...
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git no está instalado o no se encuentra en el PATH.
    echo Por favor descarga e instala Git desde: https://git-scm.com/
    echo Luego vuelve a ejecutar este archivo.
    echo.
    pause
    exit /b
)

echo [OK] Git encontrado.
echo.
echo Inicializando repositorio local si no existe...
if not exist ".git" (
    git init
    git branch -M main
)

echo.
echo Agregando archivos del proyecto...
git add .

echo.
set /p commitMsg="Escribe el mensaje del commit (Presiona ENTER para usar mensaje por defecto): "
if "%commitMsg%"=="" set commitMsg=feat: Actualizacion proyecto Mis Tablas - Evaluacion Final II Semestre

git commit -m "%commitMsg%"

echo.
git remote -v >nul 2>nul
if %errorlevel% neq 0 (
    echo Configura tu repositorio remoto de GitHub:
    echo (Ejemplo: https://github.com/TU-USUARIO/misTablas.git)
    set /p repoUrl="Pega la URL de tu repositorio en GitHub: "
    if not "%repoUrl%"=="" (
        git remote add origin %repoUrl%
    )
)

echo.
echo Subiendo cambios a GitHub...
git push -u origin main

echo.
echo ========================================================
echo   ¡Proceso finalizado! Revisa tu repositorio en GitHub.
echo ========================================================
pause
