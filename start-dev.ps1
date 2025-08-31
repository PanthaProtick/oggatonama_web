# PowerShell script to start both backend and frontend
Write-Host "Starting backend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; node index.js"

Start-Sleep -Seconds 2

Write-Host "Starting frontend server..." -ForegroundColor Green  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"

Write-Host "Both servers are starting up!" -ForegroundColor Yellow
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
