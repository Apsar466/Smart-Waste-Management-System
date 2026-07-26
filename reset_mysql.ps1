# MySQL Password Reset Script - Run as Administrator
$mysql_bin = "C:\Program Files\MySQL\MySQL Server 8.0\bin"
$mysqld = "$mysql_bin\mysqld.exe"
$mysql = "$mysql_bin\mysql.exe"
$my_ini = "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini"
$newPassword = "smartwaste123"

Write-Host "[1/5] Stopping MySQL80 service..." -ForegroundColor Yellow
Stop-Service -Name "MySQL80" -Force
Start-Sleep -Seconds 3
Write-Host "     Stopped." -ForegroundColor Green

Write-Host "[2/5] Writing SQL reset file..." -ForegroundColor Yellow
$resetSql = "ALTER USER 'root'@'localhost' IDENTIFIED BY '$newPassword'; FLUSH PRIVILEGES;"
$resetFile = "$env:TEMP\reset_mysql_pw.sql"
Set-Content -Path $resetFile -Value $resetSql -Encoding UTF8
Write-Host "     Done: $resetFile" -ForegroundColor Green

Write-Host "[3/5] Starting mysqld with --init-file to reset password..." -ForegroundColor Yellow
$proc = Start-Process -FilePath $mysqld -ArgumentList "--defaults-file=`"$my_ini`"", "--init-file=`"$resetFile`"", "--user=root" -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 10
Write-Host "     Waiting for mysqld to apply changes..." -ForegroundColor Green
Stop-Process -Name "mysqld" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

Write-Host "[4/5] Restarting MySQL80 service normally..." -ForegroundColor Yellow
Start-Service -Name "MySQL80"
Start-Sleep -Seconds 4
Write-Host "     Started." -ForegroundColor Green

Write-Host "[5/5] Creating smart_waste database..." -ForegroundColor Yellow
$cnf = "[client]`nuser=root`npassword=$newPassword"
Set-Content -Path "$env:TEMP\mc.cnf" -Value $cnf -Encoding UTF8
$result = & $mysql --defaults-file="$env:TEMP\mc.cnf" -e "CREATE DATABASE IF NOT EXISTS smart_waste CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; SELECT 'DB created' AS Status;" 2>&1
Write-Host "     $result" -ForegroundColor Green

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  SUCCESS! MySQL root password is now: smartwaste123" -ForegroundColor Cyan
Write-Host "  Database 'smart_waste' is ready." -ForegroundColor Cyan
Write-Host "  You can now run start_app.bat to launch the backend!" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
