# **Решение проблемы: Test-NetConnection не работает**

## **1. Быстрая диагностика проблемы**

### **Проверьте версию PowerShell и ОС:**
```powershell
# Проверка версии PowerShell
$PSVersionTable.PSVersion

# Проверка ОС
[System.Environment]::OSVersion.Version

# Проверка доступности модуля
Get-Module -Name NetTCPIP -ListAvailable
```

**Test-NetConnection доступен в:**
- Windows 8.1 / Windows Server 2012 R2 и выше
- PowerShell 4.0 и выше
- Требует модуля `NetTCPIP`

## **2. Альтернативы Test-NetConnection**

### **Альтернатива 1: Старый добрый ping**
```powershell
# Базовый ping
ping 8.8.8.8
ping google.com

# С контролем количества попыток
ping 8.8.8.8 -n 4

# С размером пакета
ping 8.8.8.8 -l 1024

# Непрерывный ping
ping 8.8.8.8 -t

# Сохранение результата
ping 8.8.8.8 -n 10 > C:\ping_result.txt
```

### **Альтернатива 2: Test-Connection (PowerShell 2.0+)**
```powershell
# Базовый тест подключения
Test-Connection 8.8.8.8

# Несколько попыток
Test-Connection 8.8.8.8 -Count 4

# Тестирование с определенного источника
Test-Connection -ComputerName 8.8.8.8 -Source "localhost"

# Быстрый тест (только 1 попытка)
Test-Connection 8.8.8.8 -Quiet

# Детальная информация
Test-Connection 8.8.8.8 -Count 2 | Format-List *

# Тестирование нескольких хостов
"8.8.8.8", "google.com", "yahoo.com" | ForEach-Object {
    $result = Test-Connection $_ -Count 1 -Quiet
    [PSCustomObject]@{
        Host = $_
        Reachable = $result
        Time = Get-Date
    }
}
```

### **Альтернатива 3: System.Net.NetworkInformation**
```powershell
# Использование .NET классов
function Test-Ping {
    param(
        [string]$ComputerName,
        [int]$Timeout = 1000
    )
    
    $ping = New-Object System.Net.NetworkInformation.Ping
    try {
        $reply = $ping.Send($ComputerName, $Timeout)
        [PSCustomObject]@{
            ComputerName = $ComputerName
            Status = $reply.Status
            Address = $reply.Address.IPAddressToString
            RoundtripTime = $reply.RoundtripTime
            TimeToLive = $reply.Options.Ttl
            BufferSize = $reply.Buffer.Length
        }
    }
    catch {
        [PSCustomObject]@{
            ComputerName = $ComputerName
            Status = "Failed"
            Error = $_.Exception.Message
        }
    }
}

# Использование
Test-Ping "8.8.8.8"
Test-Ping "google.com"

# Пакетное тестирование
$hosts = @("8.8.8.8", "1.1.1.1", "google.com", "localhost")
foreach ($host in $hosts) {
    Test-Ping $host
}
```

### **Альтернатива 4: telnet для проверки портов**
```powershell
# Проверка доступности порта
function Test-Port {
    param(
        [string]$ComputerName,
        [int]$Port,
        [int]$Timeout = 1000
    )
    
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $connect = $tcpClient.BeginConnect($ComputerName, $Port, $null, $null)
    
    if ($connect.AsyncWaitHandle.WaitOne($Timeout, $false)) {
        try {
            $tcpClient.EndConnect($connect)
            $tcpClient.Close()
            $true
        }
        catch {
            $false
        }
    }
    else {
        $tcpClient.Close()
        $false
    }
}

# Использование
Test-Port -ComputerName "google.com" -Port 80
Test-Port -ComputerName "8.8.8.8" -Port 53

# Проверка нескольких портов
$ports = @(80, 443, 22, 3389)
foreach ($port in $ports) {
    $result = Test-Port -ComputerName "google.com" -Port $port
    Write-Host "Port $port : $($result ? 'OPEN' : 'CLOSED')"
}
```

## **3. Полная замена Test-NetConnection**

### **Функция-замена для Test-NetConnection:**
```powershell
function Test-MyNetConnection {
    param(
        [Parameter(Mandatory=$true)]
        [string]$ComputerName,
        
        [int]$Port,
        [int]$PingCount = 4,
        [int]$Timeout = 1000,
        [switch]$TraceRoute,
        [switch]$Detailed
    )
    
    $result = [PSCustomObject]@{
        ComputerName = $ComputerName
        RemoteAddress = $null
        InterfaceAlias = $null
        SourceAddress = $null
        PingSucceeded = $false
        PingReplyDetails = $null
        PortTest = if ($Port) { "NotTested" } else { "NotRequested" }
        PortOpen = $false
        TraceRoute = if ($TraceRoute) { @() } else { $null }
        Detailed = $Detailed
    }
    
    # Проверка через ping
    Write-Host "`nTesting connection to $ComputerName..." -ForegroundColor Cyan
    
    try {
        # Разрешение DNS
        $remoteAddress = [System.Net.Dns]::GetHostAddresses($ComputerName) | Select-Object -First 1
        $result.RemoteAddress = $remoteAddress.IPAddressToString
        
        # Ping тест
        $pingResults = @()
        $successCount = 0
        
        for ($i = 1; $i -le $PingCount; $i++) {
            $ping = New-Object System.Net.NetworkInformation.Ping
            $pingReply = $ping.Send($ComputerName, $Timeout)
            
            $pingResult = [PSCustomObject]@{
                Attempt = $i
                Status = $pingReply.Status
                Address = $pingReply.Address.IPAddressToString
                RoundtripTime = $pingReply.RoundtripTime
                TimeToLive = $pingReply.Options.Ttl
                BufferSize = $pingReply.Buffer.Length
            }
            
            $pingResults += $pingResult
            
            if ($pingReply.Status -eq 'Success') {
                $successCount++
            }
            
            Start-Sleep -Milliseconds 200
        }
        
        $result.PingSucceeded = ($successCount -gt 0)
        $result.PingReplyDetails = $pingResults
        
        # Определение сетевого интерфейса
        $sourceAddress = (Test-Connection -ComputerName $ComputerName -Count 1).SourceAddress
        $result.SourceAddress = $sourceAddress
        
        # Поиск интерфейса
        $interface = Get-NetIPConfiguration | Where-Object { 
            $_.IPv4Address.IPAddress -eq $sourceAddress 
        } | Select-Object -First 1
        
        if ($interface) {
            $result.InterfaceAlias = $interface.InterfaceAlias
        }
        
    }
    catch {
        Write-Host "Ping test failed: $($_.Exception.Message)" -ForegroundColor Red
        $result.PingSucceeded = $false
    }
    
    # Проверка порта
    if ($Port) {
        Write-Host "Testing port $Port..." -ForegroundColor Cyan
        $result.PortTest = "Tested"
        
        try {
            $portTestResult = Test-Port -ComputerName $ComputerName -Port $Port -Timeout $Timeout
            $result.PortOpen = $portTestResult
        }
        catch {
            Write-Host "Port test failed: $($_.Exception.Message)" -ForegroundColor Red
            $result.PortOpen = $false
        }
    }
    
    # Traceroute (если запрошен)
    if ($TraceRoute) {
        Write-Host "Performing traceroute..." -ForegroundColor Cyan
        $traceResult = Test-MyTraceRoute -ComputerName $ComputerName -MaxHops 30
        $result.TraceRoute = $traceResult
    }
    
    return $result
}

# Функция для traceroute
function Test-MyTraceRoute {
    param(
        [string]$ComputerName,
        [int]$MaxHops = 30,
        [int]$Timeout = 1000
    )
    
    $results = @()
    
    for ($ttl = 1; $ttl -le $MaxHops; $ttl++) {
        $ping = New-Object System.Net.NetworkInformation.Ping
        $options = New-Object System.Net.NetworkInformation.PingOptions
        $options.Ttl = $ttl
        $options.DontFragment = $true
        
        $buffer = [byte[]]::new(32)
        
        try {
            $reply = $ping.Send($ComputerName, $Timeout, $buffer, $options)
            
            $result = [PSCustomObject]@{
                Hop = $ttl
                Address = $reply.Address.IPAddressToString
                Status = $reply.Status
                RoundtripTime = $reply.RoundtripTime
            }
            
            $results += $result
            
            # Если достигли цели
            if ($reply.Status -eq 'Success') {
                break
            }
        }
        catch {
            $result = [PSCustomObject]@{
                Hop = $ttl
                Address = "Timeout"
                Status = "Failed"
                RoundtripTime = 0
            }
            $results += $result
        }
        
        Start-Sleep -Milliseconds 100
    }
    
    return $results
}

# Пример использования
Test-MyNetConnection -ComputerName "google.com"
Test-MyNetConnection -ComputerName "8.8.8.8" -Port 53
Test-MyNetConnection -ComputerName "yahoo.com" -TraceRoute -Detailed
```

## **4. Диагностика и исправление Test-NetConnection**

### **Если Test-NetConnection "не работает":**

#### **Вариант 1: Модуль не импортирован**
```powershell
# Проверка установки модуля
Get-Module -Name NetTCPIP -ListAvailable

# Импорт модуля вручную
Import-Module NetTCPIP -Force

# Проверка доступности командлета
Get-Command Test-NetConnection -ErrorAction SilentlyContinue
```

#### **Вариант 2: PowerShell ограниченный режим**
```powershell
# Проверка политики выполнения
Get-ExecutionPolicy

# Изменение политики (требует прав администратора)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Или временно
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
```

#### **Вариант 3: Проблема с .NET Framework**
```powershell
# Проверка версии .NET
Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full" | Select-Object Version

# Перерегистрация модулей (администратор)
# 1. Открыть PowerShell от имени администратора
# 2. Выполнить:
dism /online /enable-feature /featurename:NetFx4-AdvSrvs /all
```

#### **Вариант 4: Повреждение системных файлов**
```powershell
# Проверка системных файлов (администратор)
sfc /scannow

# Восстановление PowerShell
# 1. Удалить PowerShell
# 2. Скачать с официального сайта
# 3. Установить заново
```

## **5. Старые системы (Windows 7 / Server 2008 R2)**

### **Для Windows 7 / Server 2008 R2:**

#### **Установка PowerShell 5.1:**
1. Скачать с [официального сайта Microsoft](https://www.microsoft.com/en-us/download/details.aspx?id=54616)
2. Установить в порядке:
   - Windows Management Framework 4.0
   - Windows Management Framework 5.1

#### **Альтернативные команды для старых систем:**
```powershell
# Windows 7 / Server 2008 R2 альтернативы

# 1. ping с анализом
function Get-PingStatistics {
    param([string]$Target)
    
    $ping = New-Object System.Net.NetworkInformation.Ping
    $results = @()
    
    for ($i = 0; $i -lt 4; $i++) {
        $reply = $ping.Send($Target)
        $results += [PSCustomObject]@{
            Attempt = $i + 1
            Status = $reply.Status
            Address = $reply.Address.ToString()
            Roundtrip = $reply.RoundtripTime
            TTL = $reply.Options.Ttl
        }
        Start-Sleep -Seconds 1
    }
    
    return $results
}

# 2. Проверка портов (без Test-NetConnection)
function Test-TCPPort {
    param(
        [string]$ComputerName,
        [int]$Port,
        [int]$Timeout = 1000
    )
    
    $tcp = New-Object System.Net.Sockets.TcpClient
    $beginConnect = $tcp.BeginConnect($ComputerName, $Port, $null, $null)
    
    Start-Sleep -Milliseconds $Timeout
    if ($tcp.Connected) {
        $tcp.Close()
        return $true
    }
    else {
        $tcp.Close()
        return $false
    }
}

# 3. Полный сетевой тест для старых систем
function Test-NetworkConnectivity {
    param([string]$HostName)
    
    Write-Host "`n=== Network Diagnostic for: $HostName ===" -ForegroundColor Yellow
    
    # DNS Resolution
    Write-Host "`n[1] DNS Resolution:" -ForegroundColor Cyan
    try {
        $ipAddresses = [System.Net.Dns]::GetHostAddresses($HostName)
        $ipAddresses | ForEach-Object {
            Write-Host "  Resolved to: $($_.IPAddressToString)" -ForegroundColor Green
        }
        $primaryIP = $ipAddresses[0].IPAddressToString
    }
    catch {
        Write-Host "  DNS Resolution FAILED: $($_.Exception.Message)" -ForegroundColor Red
        return
    }
    
    # Ping Test
    Write-Host "`n[2] Ping Test:" -ForegroundColor Cyan
    $ping = New-Object System.Net.NetworkInformation.Ping
    $pingResults = @()
    
    for ($i = 1; $i -le 4; $i++) {
        $reply = $ping.Send($primaryIP, 1000)
        $status = if ($reply.Status -eq 'Success') { "Success" } else { "Failed" }
        $color = if ($reply.Status -eq 'Success') { "Green" } else { "Red" }
        
        Write-Host "  Attempt $i : $status ($($reply.RoundtripTime)ms)" -ForegroundColor $color
        $pingResults += $reply
    }
    
    # Common Ports Test
    Write-Host "`n[3] Common Ports Test:" -ForegroundColor Cyan
    $commonPorts = @(
        @{Port=80; Service="HTTP"},
        @{Port=443; Service="HTTPS"},
        @{Port=53; Service="DNS"},
        @{Port=25; Service="SMTP"}
    )
    
    foreach ($portInfo in $commonPorts) {
        $isOpen = Test-TCPPort -ComputerName $primaryIP -Port $portInfo.Port -Timeout 500
        $status = if ($isOpen) { "OPEN" } else { "CLOSED" }
        $color = if ($isOpen) { "Green" } else { "Yellow" }
        
        Write-Host "  Port $($portInfo.Port) ($($portInfo.Service)): $status" -ForegroundColor $color
    }
    
    # Summary
    Write-Host "`n=== Summary ===" -ForegroundColor Yellow
    $successfulPings = ($pingResults | Where-Object { $_.Status -eq 'Success' }).Count
    Write-Host "Successful pings: $successfulPings/4"
    
    if ($successfulPings -eq 0) {
        Write-Host "`n❌ Host is unreachable" -ForegroundColor Red
    }
    elseif ($successfulPings -lt 4) {
        Write-Host "`n⚠️  Host is reachable but with packet loss" -ForegroundColor Yellow
    }
    else {
        Write-Host "`n✅ Host is fully reachable" -ForegroundColor Green
    }
}

# Использование
Test-NetworkConnectivity "google.com"
```

## **6. Универсальные решения для всех версий Windows**

### **Решение 1: Бат-файл для быстрой диагностики**
```batch
@echo off
REM network_test.bat
echo ========================================
echo Network Diagnostic Tool
echo ========================================
echo.

set /p host=Enter hostname or IP: 

echo.
echo [1] Testing DNS resolution...
nslookup %host%

echo.
echo [2] Testing connectivity (ping)...
ping %host% -n 4

echo.
echo [3] Testing common ports...
echo Testing port 80 (HTTP)...
powershell -Command "& {(New-Object Net.Sockets.TcpClient).BeginConnect('%host%',80,$null,$null).AsyncWaitHandle.WaitOne(1000)}" && echo OPEN || echo CLOSED

echo Testing port 443 (HTTPS)...
powershell -Command "& {(New-Object Net.Sockets.TcpClient).BeginConnect('%host%',443,$null,$null).AsyncWaitHandle.WaitOne(1000)}" && echo OPEN || echo CLOSED

echo.
echo [4] Tracing route...
tracert %host% -h 10

echo.
echo ========================================
echo Diagnostic complete!
pause
```

### **Решение 2: PowerShell профиль с алиасами**
```powershell
# Добавьте в ваш PowerShell профиль ($PROFILE)

# Алиас для ping
function p {
    param([string]$Target, [int]$Count = 4)
    ping $Target -n $Count
}
Set-Alias pingtest p

# Алиас для проверки порта
function porttest {
    param([string]$HostName, [int]$Port)
    
    $tcp = New-Object System.Net.Sockets.TcpClient
    $connection = $tcp.BeginConnect($HostName, $Port, $null, $null)
    
    if ($connection.AsyncWaitHandle.WaitOne(1000, $false)) {
        try {
            $tcp.EndConnect($connection)
            Write-Host "Port $Port on $HostName is OPEN" -ForegroundColor Green
            $tcp.Close()
            return $true
        }
        catch {
            Write-Host "Port $Port on $HostName is CLOSED" -ForegroundColor Red
            $tcp.Close()
            return $false
        }
    }
    else {
        Write-Host "Port $Port on $HostName is CLOSED (timeout)" -ForegroundColor Yellow
        $tcp.Close()
        return $false
    }
}

# Алиас для полного теста
function netdiag {
    param([string]$HostName = "8.8.8.8")
    
    Write-Host "`n=== Network Diagnostic: $HostName ===" -ForegroundColor Cyan
    
    # Ping
    Write-Host "`nPing test:" -ForegroundColor Yellow
    ping $HostName -n 2
    
    # DNS
    Write-Host "`nDNS resolution:" -ForegroundColor Yellow
    nslookup $HostName 2>null
    
    # Ports
    Write-Host "`nCommon ports:" -ForegroundColor Yellow
    $ports = @(80, 443, 53, 22, 3389)
    foreach ($port in $ports) {
        $result = porttest $HostName $port
    }
}

# Использование:
# pingtest google.com
# porttest google.com 443
# netdiag 8.8.8.8
```

## **7. Таблица совместимости и альтернатив**

| Задача | PowerShell 5.1+ | PowerShell 4.0 | PowerShell 3.0- | Windows 7/2008R2 |
|--------|-----------------|----------------|-----------------|------------------|
| **Базовый ping** | `Test-Connection` | `Test-Connection` | `Test-Connection` | `ping` |
| **Проверка порта** | `Test-NetConnection -Port` | `Test-Connection -TcpPort` | Функция `Test-TCPPort` | Функция `Test-TCPPort` |
| **Traceroute** | `Test-NetConnection -TraceRoute` | ❌ | `tracert.exe` | `tracert.exe` |
| **Информация об интерфейсе** | `Get-NetIPConfiguration` | `Get-NetAdapter` | `ipconfig` | `ipconfig` |
| **DNS разрешение** | `Resolve-DnsName` | `[System.Net.Dns]` | `[System.Net.Dns]` | `nslookup.exe` |

## **8. Быстрые команды для разных ситуаций**

### **Для диагностики интернета:**
```powershell
# Все в одной строке
ping 8.8.8.8 -n 2 && nslookup google.com && tracert -h 5 8.8.8.8

# Проверка нескольких DNS
$dnsServers = @("8.8.8.8", "1.1.1.1", "77.88.8.8")
foreach ($dns in $dnsServers) {
    $result = ping $dns -n 1 -w 1000 > $null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "$dns - OK" -ForegroundColor Green
    } else {
        Write-Host "$dns - FAILED" -ForegroundColor Red
    }
}
```

### **Для проверки веб-сайтов:**
```powershell
function Test-Website {
    param([string]$Url)
    
    try {
        $request = [System.Net.WebRequest]::Create($Url)
        $request.Timeout = 5000
        $response = $request.GetResponse()
        
        Write-Host "$Url - Status: $($response.StatusCode)" -ForegroundColor Green
        $response.Close()
        return $true
    }
    catch {
        Write-Host "$Url - ERROR: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

Test-Website "https://google.com"
Test-Website "https://yandex.ru"
```

### **Для мониторинга в реальном времени:**
```powershell
function Watch-Connectivity {
    param([string]$Target = "8.8.8.8", [int]$Interval = 5)
    
    Write-Host "Monitoring connectivity to $Target every ${Interval}s" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop`n" -ForegroundColor Yellow
    
    while ($true) {
        $timestamp = Get-Date -Format "HH:mm:ss"
        $result = ping $Target -n 1 -w 1000 > $null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[$timestamp] $Target - OK" -ForegroundColor Green
        } else {
            Write-Host "[$timestamp] $Target - DOWN" -ForegroundColor Red
        }
        
        Start-Sleep -Seconds $Interval
    }
}

# Использование
Watch-Connectivity -Target "google.com" -Interval 10
```

## **9. Рекомендации по устранению проблем**

### **Если ничего не работает:**

1. **Проверьте физическое подключение**
   ```batch
   ipconfig /all
   ```
   
2. **Перезагрузите сетевое оборудование**
   ```batch
   ipconfig /release
   ipconfig /renew
   ipconfig /flushdns
   netsh winsock reset
   ```

3. **Используйте встроенные утилиты Windows**
   ```batch
   # Диагностика сети
   msdt.exe /id NetworkDiagnosticsWeb
   
   # Сброс сетевых настроек
   netsh int ip reset
   netsh winsock reset
   ```

4. **Создайте простой bat-файл для диагностики**
   ```batch
   @echo off
   echo Network Diagnostic Tool
   echo =======================
   echo.
   echo 1. IP Configuration
   ipconfig /all
   echo.
   echo 2. Testing Google DNS
   ping 8.8.8.8
   echo.
   echo 3. Testing DNS Resolution
   nslookup google.com
   echo.
   echo 4. Network Route
   route print
   echo.
   pause
   ```

## **10. Заключение**

**Краткое руководство:**

1. **Windows 10/11, Server 2016+**: Используйте `Test-NetConnection`
2. **Windows 8.1/Server 2012 R2**: Используйте `Test-Connection`
3. **Windows 7/Server 2008 R2**: Используйте `ping`, `tracert`, `telnet`
4. **PowerShell 3.0+**: Используйте функции из этого руководства
5. **Всегда**: Имейте резервные методы диагностики

**Главное правило системного администратора:**
> "Всегда имейте несколько способов диагностировать проблему. Если один инструмент не работает, переходите к следующему."

**Сохраните этот файл как `NetworkTools.ps1` и используйте когда нужно!**
