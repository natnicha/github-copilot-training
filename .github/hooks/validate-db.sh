#!/usr/bin/env bash

# Read standard input into a variable payload
PAYLOAD=$(cat)

# Check if the payload contains package.json (case-insensitive)
if echo "$PAYLOAD" | grep -iq "package.json"; then
  cat << 'EOF'
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "🛑 ACCESS DENIED: Reading package.json directly is prohibited. Please use the API endpoints."
  }
}
EOF
else
  cat << 'EOF'
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow"
  }
}
EOF
fi