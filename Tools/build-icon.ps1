# Render the repo-native SVG primitives to PNG and a multi-resolution Windows ICO.
# No fonts, downloads, third-party packages, or machine-specific emoji rendering.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$assetDirectory = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\Assets'))
[xml]$drawing = Get-Content -LiteralPath (Join-Path $assetDirectory 'alg0vault-robot.svg') -Raw

function New-RobotPng([int]$size) {
    $bitmap = [Drawing.Bitmap]::new($size, $size)
    $graphics = [Drawing.Graphics]::FromImage($bitmap)
    try {
        $graphics.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::AntiAlias
        $graphics.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.Clear([Drawing.Color]::Transparent)
        $graphics.ScaleTransform($size / 256.0, $size / 256.0)
        foreach ($shape in $drawing.DocumentElement.ChildNodes) {
            $geometry = [Drawing.Drawing2D.GraphicsPath]::new()
            $fill = $null; $stroke = $null
            try {
                switch ($shape.LocalName) {
                    'circle' {
                        $radius = [single]$shape.r
                        $geometry.AddEllipse([single]$shape.cx - $radius, [single]$shape.cy - $radius, 2*$radius, 2*$radius)
                    }
                    'line' { $geometry.AddLine([single]$shape.x1, [single]$shape.y1, [single]$shape.x2, [single]$shape.y2) }
                    'rect' {
                        $x = [single]$shape.x; $y = [single]$shape.y
                        $width = [single]$shape.width; $height = [single]$shape.height
                        $diameter = 2 * [single]$shape.rx
                        $geometry.AddArc($x, $y, $diameter, $diameter, 180, 90)
                        $geometry.AddArc($x+$width-$diameter, $y, $diameter, $diameter, 270, 90)
                        $geometry.AddArc($x+$width-$diameter, $y+$height-$diameter, $diameter, $diameter, 0, 90)
                        $geometry.AddArc($x, $y+$height-$diameter, $diameter, $diameter, 90, 90)
                        $geometry.CloseFigure()
                    }
                    default { throw "Unsupported SVG primitive: $($shape.LocalName)" }
                }
                if ($shape.HasAttribute('fill')) {
                    $fill = [Drawing.SolidBrush]::new([Drawing.ColorTranslator]::FromHtml($shape.fill))
                    $graphics.FillPath($fill, $geometry)
                }
                if ($shape.HasAttribute('stroke')) {
                    $stroke = [Drawing.Pen]::new([Drawing.ColorTranslator]::FromHtml($shape.stroke), [single]$shape.GetAttribute('stroke-width'))
                    $graphics.DrawPath($stroke, $geometry)
                }
            } finally {
                if ($fill) { $fill.Dispose() }
                if ($stroke) { $stroke.Dispose() }
                $geometry.Dispose()
            }
        }
        $stream = [IO.MemoryStream]::new()
        try {
            $bitmap.Save($stream, [Drawing.Imaging.ImageFormat]::Png)
            return ,$stream.ToArray()
        } finally { $stream.Dispose() }
    } finally { $graphics.Dispose(); $bitmap.Dispose() }
}

[IO.File]::WriteAllBytes((Join-Path $assetDirectory 'alg0vault-icon.png'), (New-RobotPng 512))
$sizes = @(16, 20, 24, 32, 40, 48, 64, 128, 256)
$images = @($sizes | ForEach-Object { ,(New-RobotPng $_) })
$iconStream = [IO.MemoryStream]::new()
$writer = [IO.BinaryWriter]::new($iconStream)
try {
    $writer.Write([uint16]0); $writer.Write([uint16]1); $writer.Write([uint16]$sizes.Count)
    $offset = 6 + 16 * $sizes.Count
    for ($i = 0; $i -lt $sizes.Count; $i++) {
        $dimension = if ($sizes[$i] -eq 256) { 0 } else { $sizes[$i] }
        $writer.Write([byte]$dimension); $writer.Write([byte]$dimension)
        $writer.Write([byte]0); $writer.Write([byte]0)
        $writer.Write([uint16]1); $writer.Write([uint16]32)
        $writer.Write([uint32]$images[$i].Length); $writer.Write([uint32]$offset)
        $offset += $images[$i].Length
    }
    foreach ($bytes in $images) { $writer.Write([byte[]]$bytes) }
    $writer.Flush()
    [IO.File]::WriteAllBytes((Join-Path $assetDirectory 'alg0vault.ico'), $iconStream.ToArray())
} finally { $writer.Dispose(); $iconStream.Dispose() }
Write-Output 'Built robot PNG and nine-resolution Windows ICO from the SVG source.'
