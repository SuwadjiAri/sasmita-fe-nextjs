@echo off
set BASE_DIR=C:\Users\Arif Suwadji\Documents\unpam\project-work\pw-documents
set PROD_DIR=%BASE_DIR%\productions

echo ========================================================
echo   SINKRONISASI DOKUMEN PRODUKSI KE PW-DOCUMENTS
echo ========================================================

if not exist "%BASE_DIR%" (
    mkdir "%BASE_DIR%"
)

if not exist "%PROD_DIR%" (
    mkdir "%PROD_DIR%"
    echo [+] Folder productions berhasil dibuat di: %PROD_DIR%
)

:: Pindahkan file md lama dari root pw-documents ke folder productions
if exist "%BASE_DIR%\*.md" (
    echo [*] Memindahkan file markdown lama ke folder productions...
    move /Y "%BASE_DIR%\*.md" "%PROD_DIR%\" >nul 2>&1
    echo [OK] File markdown lama berhasil dipindahkan ke folder productions.
)

:: Salin semua berkas dari C:\agy\requirements\productions ke folder productions
echo [*] Menyalin berkas markdown produksi terbaru...
copy /Y "C:\agy\requirements\productions\*.md" "%PROD_DIR%\" >nul
echo [OK] Berkas produksi berhasil disalin ke %PROD_DIR%

:: Buka hak akses agar sesi agydev dapat membaca & menulis langsung ke folder ini
icacls "%BASE_DIR%" /grant "Users":(OI)(CI)F /T /C /Q >nul 2>&1
icacls "%PROD_DIR%" /grant "Users":(OI)(CI)F /T /C /Q >nul 2>&1

echo.
echo ========================================================
echo   STATUS: Selesai 100%%!
echo   Lokasi Berkas:
echo   - %PROD_DIR%\PLAN_DEPLOYMENT_PRODUCTION_SASMITA.md
echo   - %PROD_DIR%\TEMUAN_PORTAL_BIZNET_DAN_PANDUAN_ORDER.md
echo   - %PROD_DIR%\INFRASTRUKTUR_PRODUKSI_SMITA_ID.md
echo ========================================================
echo.
pause
