#!/usr/bin/env python3
"""
Verify that all product images are consistent and exist across:
1. SearchContext (shop page)
2. Individual product page data
3. Products page data  
4. Physical image files
"""

import os
import json
import re

def extract_image_paths_from_file(file_path, pattern):
    """Extract image paths from a TypeScript file using regex"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        matches = re.findall(pattern, content)
        return matches
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return []

def check_physical_images():
    """Check what image files actually exist"""
    image_dir = 'public/images/products'
    if not os.path.exists(image_dir):
        print(f"❌ Image directory {image_dir} doesn't exist!")
        return []
    
    images = []
    for file in os.listdir(image_dir):
        if file.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            images.append(f"/images/products/{file}")
    
    print(f"📁 Found {len(images)} physical image files:")
    for img in sorted(images):
        print(f"   ✅ {img}")
    return images

def main():
    print("🔍 COMPREHENSIVE IMAGE VERIFICATION")
    print("=" * 50)
    
    # Check physical images first
    physical_images = check_physical_images()
    
    print("\n🔍 EXTRACTING IMAGE REFERENCES FROM CODE:")
    print("=" * 50)
    
    # Extract from SearchContext
    search_context_images = extract_image_paths_from_file(
        'src/contexts/SearchContext.tsx',
        r"image: ['\"]([^'\"]+)['\"]"
    )
    print(f"\n📱 SearchContext images ({len(search_context_images)}):")
    for img in search_context_images:
        exists = img in physical_images
        status = "✅" if exists else "❌"
        print(f"   {status} {img}")
    
    # Extract from individual product page
    individual_page_images = extract_image_paths_from_file(
        'src/app/products/[id]/page.tsx',
        r'images: \[[^\]]*[\'"]([^\'"]+)[\'"][^\]]*\]'
    )
    print(f"\n🔍 Individual product page images ({len(individual_page_images)}):")
    for img in individual_page_images:
        exists = img in physical_images
        status = "✅" if exists else "❌"
        print(f"   {status} {img}")
    
    # Extract from products page
    products_page_images = extract_image_paths_from_file(
        'src/app/products/page.tsx',
        r'image: [\'"]([^\'\"]+)[\'"]'
    )
    print(f"\n📋 Products page images ({len(products_page_images)}):")
    for img in products_page_images:
        exists = img in physical_images
        status = "✅" if exists else "❌"
        print(f"   {status} {img}")
    
    print("\n🔍 CONSISTENCY CHECK:")
    print("=" * 50)
    
    # Check for missing images
    all_referenced_images = set(search_context_images + individual_page_images + products_page_images)
    missing_images = all_referenced_images - set(physical_images)
    
    if missing_images:
        print(f"❌ Missing image files ({len(missing_images)}):")
        for img in sorted(missing_images):
            print(f"   📁 {img}")
    else:
        print("✅ All referenced images exist physically!")
    
    # Check for unused images
    unused_images = set(physical_images) - all_referenced_images
    if unused_images:
        print(f"\n⚠️  Unused image files ({len(unused_images)}):")
        for img in sorted(unused_images):
            print(f"   📁 {img}")
    else:
        print("\n✅ No unused image files!")
    
    print(f"\n📊 SUMMARY:")
    print(f"   Physical images: {len(physical_images)}")
    print(f"   SearchContext images: {len(search_context_images)}")  
    print(f"   Individual page images: {len(individual_page_images)}")
    print(f"   Products page images: {len(products_page_images)}")
    print(f"   Missing images: {len(missing_images)}")
    print(f"   Unused images: {len(unused_images)}")

if __name__ == "__main__":
    main()
