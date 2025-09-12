#!/bin/bash

# Font conversion script - TTF to WOFF
# This script converts all TTF fonts in the src/fonts directory to WOFF format

echo "Starting font conversion from TTF to WOFF..."

# Check if fonttools is installed
if ! command -v pyftsubset &> /dev/null; then
    echo "fonttools is not installed. Installing it now..."
    pip install fonttools[woff]
fi

# Navigate to the fonts directory
cd "$(dirname "$0")/src/fonts"

# Create a backup directory
mkdir -p backup

# Convert each TTF file to WOFF
for ttf_file in *.ttf; do
    if [ -f "$ttf_file" ]; then
        echo "Converting $ttf_file to WOFF..."
        
        # Create backup
        cp "$ttf_file" "backup/$ttf_file"
        
        # Convert to WOFF using pyftsubset
        # This creates a WOFF file with the same name but .woff extension
        woff_file="${ttf_file%.ttf}.woff"
        pyftsubset "$ttf_file" --output-file="$woff_file" --flavor=woff
        
        if [ $? -eq 0 ]; then
            echo "✓ Successfully converted $ttf_file to $woff_file"
        else
            echo "✗ Failed to convert $ttf_file"
        fi
    fi
done

echo ""
echo "Font conversion complete!"
echo "Original TTF files have been backed up to the 'backup' directory."
echo "New WOFF files are ready for use in your web application."
echo ""
echo "To use the WOFF fonts in your CSS, update your @font-face declarations:"
echo "Example:"
echo "  @font-face {"
echo "    font-family: 'Courier Prime';"
echo "    src: url('./fonts/CourierPrime-Regular.woff') format('woff');"
echo "    font-weight: normal;"
echo "    font-style: normal;"
echo "  }"
