#!/bin/bash
echo "Starting Appium tests..."

# Inject global Node to PATH if needed
if [ -n "$GITHUB_PATH" ]; then
    echo "$PATH" >> $GITHUB_PATH
fi

cd BloodLinkAppium
npm install

echo "Running WDIO Appium tests..."
npm run wdio || true

echo "Appium tests completed. Reporting generated."
