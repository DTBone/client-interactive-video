# Script to install extensions from the provided JSON file

# Path to the JSON file containing extensions
$jsonFilePath = "vscode-userdata-sync://local-backup/syncResource%3Aextensions/profile%3A__default__profile__"

# Read the JSON file
$jsonContent = Get-Content -Path $jsonFilePath -Raw | ConvertFrom-Json

# Loop through each extension and install it
foreach ($extension in $jsonContent) {
    $extensionId = $extension.identifier.id
    Write-Host "Installing extension: $extensionId"
    code --install-extension $extensionId
}

Write-Host "All extensions have been installed."
