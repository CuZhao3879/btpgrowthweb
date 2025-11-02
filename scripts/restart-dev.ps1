# Safe restart script for Next.js dev server
# This script only stops the Next.js dev server on port 3000
# It will NOT affect MCP server or other Node.js processes

$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Restarting dev server safely..." -ForegroundColor Cyan

# Find process using port 3000
$port = 3000
$connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($connection) {
    $processId = $connection.OwningProcess
    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
    
    if ($process) {
        Write-Host "Found dev server process (PID: $processId)" -ForegroundColor Green
        
        # Verify it's a Next.js process by checking command line
        $commandLine = $null
        try {
            $commandLine = (Get-CimInstance Win32_Process -Filter "ProcessId = $processId" -ErrorAction Stop).CommandLine
        } catch {
            try {
                $commandLine = (Get-WmiObject Win32_Process -Filter "ProcessId = $processId" -ErrorAction Stop).CommandLine
            } catch {
                $commandLine = $process.ProcessName
            }
        }
        
        # Check if it's likely a Next.js process
        if ($commandLine -and ($commandLine -like "*next*" -or $commandLine -like "*node*next*")) {
            Write-Host "Confirmed Next.js process, stopping..." -ForegroundColor Yellow
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 2
            Write-Host "Process stopped" -ForegroundColor Green
        } elseif ($process.ProcessName -eq "node" -and $connection.LocalPort -eq 3000) {
            Write-Host "Detected Node.js on port 3000, assuming Next.js, stopping..." -ForegroundColor Yellow
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 2
            Write-Host "Process stopped" -ForegroundColor Green
        } else {
            Write-Host "Warning: Port $port is used by non-Next.js process" -ForegroundColor Yellow
            Write-Host "  Process: $($process.ProcessName) (PID: $processId)" -ForegroundColor Gray
            if ($commandLine) {
                Write-Host "  Command: $commandLine" -ForegroundColor Gray
            }
            Write-Host "  Skipping to protect other processes" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "Port $port is not in use" -ForegroundColor Gray
}

# Start the dev server
Write-Host ""
Write-Host "Starting dev server..." -ForegroundColor Cyan

# Get project root directory (parent of scripts folder)
$projectRoot = Split-Path -Parent $PSScriptRoot

# Start in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot'; npm run dev"

Write-Host ""
Write-Host "Done! Dev server is starting..." -ForegroundColor Green
Write-Host "  MCP server is not affected and connection remains active" -ForegroundColor Green
Write-Host "  Visit: http://localhost:3000" -ForegroundColor Cyan
