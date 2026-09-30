#Requires -Version 5.1
<#
Build the site: source in ledong-exhibition/  ->  single-file artifact index.html

Steps:
  1. npx vite build          -> ledong-exhibition/dist/
  2. npx html-inline         -> overwrite repo-root index.html (JS + CSS inlined)
  3. re-insert favicon link  -> the Vite template has no <link rel="icon">, so it must be added back
  4. verify                  -> no BOM, LF only, inline module script passes `node --check`

Usage:
  pwsh -File tools\build.ps1
  powershell -File tools\build.ps1

This script is intentionally pure ASCII so it runs the same under Windows
PowerShell 5.1 (ANSI codepage) and PowerShell 7 (UTF-8).
#>
[CmdletBinding()]
param(
    [switch]$KeepInlineCheck
)

$ErrorActionPreference = 'Stop'

$repoRoot  = Split-Path -Parent $PSScriptRoot
$srcDir    = Join-Path $repoRoot 'ledong-exhibition'
$target    = Join-Path $repoRoot 'index.html'
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

if (-not (Test-Path $srcDir)) { throw "source directory not found: $srcDir" }
if (-not (Test-Path $target)) { throw "existing artifact not found: $target" }

$beforeHash = (Get-FileHash $target -Algorithm SHA256).Hash
$beforeSize = (Get-Item $target).Length

# Use the locally installed binaries instead of `npx`: some npx.ps1 shims on
# Windows recompute their arguments from the invocation text and mangle them
# when the call operator is used, and this keeps the build pinned to the
# versions in package-lock.json (no registry lookups).
$binDir    = Join-Path $srcDir 'node_modules\.bin'
$viteBin   = Join-Path $binDir 'vite.cmd'
$inlineBin = Join-Path $binDir 'html-inline.cmd'
foreach ($exe in @($viteBin, $inlineBin)) {
    if (-not (Test-Path $exe)) {
        throw "not found: $exe - run 'npm i' inside ledong-exhibition first"
    }
}

Write-Host '[1/4] vite build'
Write-Host '[2/4] html-inline'
Push-Location $srcDir
try {
    & $viteBin build
    if ($LASTEXITCODE -ne 0) { throw "vite build failed (exit code $LASTEXITCODE)" }

    & $inlineBin -i dist/index.html -o $target -b dist --ignore-images
    if ($LASTEXITCODE -ne 0) { throw "html-inline failed (exit code $LASTEXITCODE)" }
}
finally {
    Pop-Location
}

Write-Host '[3/4] favicon link'
$link = '<link rel="icon" type="image/x-icon" href="./icon.ico" />'
$html = [IO.File]::ReadAllText($target, $utf8NoBom)
if ($html.Contains($link)) {
    Write-Host '      already present, skipped'
}
else {
    $titleEnd = $html.IndexOf('</title>')
    if ($titleEnd -lt 0) { throw 'no </title> found in index.html' }
    $html = $html.Insert($titleEnd + '</title>'.Length, "`n    " + $link)
    [IO.File]::WriteAllText($target, $html, $utf8NoBom)
    Write-Host '      inserted'
}

Write-Host '[4/4] verify'
$bytes = [IO.File]::ReadAllBytes($target)
if ($bytes.Length -lt 3) { throw 'index.html is empty' }
if ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    throw 'index.html starts with a UTF-8 BOM'
}

$text = [Text.Encoding]::UTF8.GetString($bytes)
$crlf = [regex]::Matches($text, "`r`n").Count
if ($crlf -ne 0) { throw "index.html contains $crlf CRLF line endings (expected LF only)" }

$scriptMatch = [regex]::Match($text, '(?s)<script type="module"[^>]*>(.*?)</script>')
if (-not $scriptMatch.Success) { throw 'inline <script type="module"> not found' }

$checkFile = Join-Path ([IO.Path]::GetTempPath()) 'ledong-inline-check.js'
[IO.File]::WriteAllText($checkFile, $scriptMatch.Groups[1].Value, $utf8NoBom)
try {
    & node --check $checkFile
    if ($LASTEXITCODE -ne 0) { throw 'node --check failed on the inline script' }
}
finally {
    if (-not $KeepInlineCheck) { Remove-Item $checkFile -Force -ErrorAction SilentlyContinue }
}

$afterHash = (Get-FileHash $target -Algorithm SHA256).Hash
$afterSize = (Get-Item $target).Length

Write-Host ''
Write-Host 'OK  index.html rebuilt'
Write-Host ('    size   : {0:N0} bytes (was {1:N0})' -f $afterSize, $beforeSize)
Write-Host ('    sha256 : {0}' -f $afterHash)
if ($afterHash -eq $beforeHash) { Write-Host '    note   : byte-identical to the previous file' }
Write-Host ''
Write-Host 'Next: review the diff, then commit'
Write-Host '    git add index.html'
Write-Host '    git commit -m "<what changed>"'
