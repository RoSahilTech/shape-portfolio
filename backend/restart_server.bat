@echo off
echo Stopping Flask server...
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *app.py*" 2>nul
timeout /t 2 /nobreak >nul
echo Starting Flask server...
cd /d "%~dp0"
python app.py
pause
