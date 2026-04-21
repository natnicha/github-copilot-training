# Read incoming JSON payload from standard input
$inputData = $input | Out-String

# Check if it references package.json
if ($inputData -match "(?i)package\.json") {
    Write-Output @"
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "🛑 ACCESS DENIED: Reading package.json directly is prohibited. Please use the API endpoints."
  }
}
"@
} else {
    Write-Output @"
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow"
  }
}
"@
}