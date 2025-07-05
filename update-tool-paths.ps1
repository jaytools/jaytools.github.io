# PowerShell script to update tool HTML files with correct paths

# Define the tool mappings - old path to new path
$toolMappings = @{
    "tools/cgpa-percentage-inline.html" = "calculator/cgpa-percentage-inline.html"
    "tools/seperate-tool/calorie-deficit.html" = "health/calorie-deficit.html"
    "tools/seperate-tool/ivf-calculator.html" = "health/ivf-calculator.html"
    "tools/exam-percentage-inline.html" = "calculator/exam-percentage-inline.html"
    "tools/gpa-percentage-inline.html" = "calculator/gpa-percentage-inline.html"
    "tools/steps-to-km-inline.html" = "converter/steps-to-km-inline.html"
    "tools/height-converter-inline.html" = "converter/height-converter-inline.html"
    "tools/seperate-tool/debt-ratio.html" = "finance/debt-ratio.html"
    "tools/seperate-tool/expense-tracker.html" = "finance/expense-tracker.html"
    "tools/age-difference-inline.html" = "personal/age-difference-inline.html"
    "tools/invite-generator-inline.html" = "personal/invite-generator-inline.html"
    "tools/marriage-age-inline.html" = "personal/marriage-age-inline.html"
    "tools/marriage-biodata-inline.html" = "personal/marriage-biodata-inline.html"
    "tools/seperate-tool/goal-planner.html" = "planner/goal-planner.html"
    "tools/seperate-tool/pomodoro.html" = "planner/pomodoro.html"
    "tools/body-frame-inline.html" = "health/body-frame-inline.html"
    "tools/seperate-tool/calories-walking.html" = "health/calories-walking.html"
    "tools/seperate-tool/food-calories.html" = "health/food-calories.html"
    "tools/seperate-tool/pregnancy-weight.html" = "health/pregnancy-weight.html"
    "tools/seperate-tool/protein-intake.html" = "health/protein-intake.html"
    "tools/seperate-tool/study-planner.html" = "study/study-planner.html"
    "tools/seperate-tool/typing-speed.html" = "study/typing-speed.html"
    "tools/sample-tool-inline.html" = "utility/sample-tool-inline.html"
    "tools/seperate-tool/dpi-checker.html" = "utility/dpi-checker.html"
    "tools/seperate-tool/sample-tool.html" = "utility/sample-tool.html"
}

# Update paths in all HTML files in category folders
$categoryFolders = @("calculator", "converter", "finance", "health", "personal", "planner", "study", "utility")
$baseDir = "c:\Users\Shivam\OneDrive\Desktop\Jay-Tools\templete"

foreach ($category in $categoryFolders) {
    $categoryPath = Join-Path $baseDir $category
    Write-Host "Processing folder: $categoryPath"
    
    # Get all HTML files in the category
    $htmlFiles = Get-ChildItem -Path $categoryPath -Filter "*.html" -File
    
    foreach ($file in $htmlFiles) {
        Write-Host "  Updating file: $($file.Name)"
        
        # Read the file content
        $content = Get-Content -Path $file.FullName -Raw
        
        # Update each path in the mapping
        foreach ($oldPath in $toolMappings.Keys) {
            $newPath = $toolMappings[$oldPath]
            
            # Different relative paths based on directory depth
            $relativePrefix = "../"
            
            # Replace paths in various patterns
            # In href attributes
            $content = $content -replace "href=`"\.\./$oldPath`"", "href=`"$relativePrefix$newPath`""
            
            # In canonical and Open Graph URLs
            $content = $content -replace "jaytools\.github\.io/$oldPath", "jaytools.github.io/$newPath"
            
            # In schema.org JSON-LD
            $content = $content -replace "`"url`":\s*`"https://jaytools\.github\.io/$oldPath`"", "`"url`": `"https://jaytools.github.io/$newPath`""
        }
        
        # Update the popular tools section specifically
        $popularToolsSection = @"
            <section class="sidebar-section">
                <h3><i class="fas fa-fire"></i> Popular Tools</h3>
                <ul class="popular-tools">
                    <li><a href="../calculator/cgpa-percentage-inline.html">CGPA to Percentage Calculator</a></li>
                    <li><a href="../health/calorie-deficit.html">Calorie Deficit Finder</a></li>
                    <li><a href="../health/ivf-calculator.html">IVF Due Date Calculator</a></li>
                </ul>
            </section>
"@
        
        # Replace the popular tools section
        $content = $content -replace '<section class="sidebar-section">\s*<h3><i class="fas fa-fire"></i> Popular Tools</h3>\s*<ul class="popular-tools">.*?</ul>\s*</section>', $popularToolsSection
        
        # Write the updated content back to the file
        Set-Content -Path $file.FullName -Value $content
    }
}

Write-Host "All HTML files updated successfully."
