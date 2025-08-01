#!/bin/bash

# Create responsive image variants for all project images
cd "$(dirname "$0")"/assets/images || exit

for img in *.png; do
  if [[ $img != *"-400.png" && $img != *"-800.png" ]]; then
    base_name="${img%.*}"
    echo "Generating responsive variants for $img..."
    
    # Create 400px width variant
    convert "$img" -resize 400x "${base_name}-400.png"
    
    # Create 800px width variant
    convert "$img" -resize 800x "${base_name}-800.png"
  fi
done

echo "All responsive images have been generated!"
