# PowerShell script to fix script.js references in all tool files

# Get all HTML files that contain script.js references
$files = Get-ChildItem -Path "." -Recurse -Include "*.html" | Where-Object {
    (Get-Content $_.FullName -Raw) -match 'src="[./]*js/script\.js"'
}

Write-Host "Found $($files.Count) files with script.js references"

foreach ($file in $files) {
    Write-Host "Processing: $($file.Name)"
    
    $content = Get-Content -Path $file.FullName -Raw
    
    # Replace script.js reference with sidebar toggle functionality
    $oldPattern = '<script src="[./]*js/script\.js"[^>]*></script>'
    $newScript = @"
<script>
        // Sidebar Toggle Functionality
        function toggleSidebar() {
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.querySelector('.overlay');
            if (sidebar && overlay) {
                sidebar.classList.toggle('active');
                overlay.classList.toggle('active');
                document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
            }
        }

        function closeSidebar() {
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.querySelector('.overlay');
            if (sidebar) sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Add event listeners
        document.addEventListener('DOMContentLoaded', function() {
            const menuToggle = document.querySelector('.menu-toggle');
            const menuClose = document.querySelector('.sidebar-close');
            const overlay = document.querySelector('.overlay');

            if (menuToggle) menuToggle.addEventListener('click', toggleSidebar);
            if (menuClose) menuClose.addEventListener('click', closeSidebar);
            if (overlay) overlay.addEventListener('click', closeSidebar);
        });
    </script>
"@
    
    $newContent = $content -replace $oldPattern, $newScript
    
    if ($newContent -ne $content) {
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
        Write-Host "✓ Fixed: $($file.Name)"
    } else {
        Write-Host "⚠ No changes needed: $($file.Name)"
    }
}

Write-Host "`nScript execution completed!"
