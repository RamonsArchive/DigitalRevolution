#!/bin/bash

# Convert all .mov files to .mp4 in public/Hero folder
# Usage: ./convert_videos.sh

echo "🎬 Starting video conversion..."

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg is not installed. Please install it first:"
    echo "   brew install ffmpeg  # macOS"
    echo "   apt install ffmpeg   # Ubuntu/Debian"
    exit 1
fi

# Check if Hero folder exists
if [ ! -d "public/Hero" ]; then
    echo "❌ public/Hero folder not found!"
    exit 1
fi

# Navigate to the Hero folder
cd public/Hero

# Counter for converted files
converted=0

# Find all .mov/.MOV files and convert them
for file in *.mov *.MOV; do
    # Check if file exists (handles case where no .mov files exist)
    if [ -f "$file" ]; then
        # Get filename without extension
        filename="${file%.*}"
        
        echo "🔄 Converting: $file"
        
        # Convert .mov to .mp4
        ffmpeg -i "$file" -c:v libx264 -c:a aac -movflags +faststart "${filename}.mp4" -y
        
        # Check if conversion was successful
        if [ $? -eq 0 ]; then
            echo "✅ Successfully converted: $file → ${filename}.mp4"
            ((converted++))
        else
            echo "❌ Failed to convert: $file"
        fi
    fi
done

# Summary
if [ $converted -eq 0 ]; then
    echo "ℹ️  No .mov files found in public/Hero folder"
else
    echo "🎉 Conversion complete! Converted $converted file(s)"
    echo "📁 Check your public/Hero folder for the new .mp4 files"
fi

echo "✨ Done!"
