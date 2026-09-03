import os
try:
    from PIL import Image, ImageEnhance
except ImportError:
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow"])
    from PIL import Image, ImageEnhance

img_path = r"x:\Self projects\AsadPFW272026\public\portrait.png"
if os.path.exists(img_path):
    print(f"Opening image: {img_path}")
    img = Image.open(img_path)
    print(f"Original resolution: {img.size[0]}x{img.size[1]}")
    
    # Convert to RGBA to preserve transparency
    img = img.convert("RGBA")
    
    # Upscale by 2.5x using Lanczos high-definition resampling
    new_width = int(img.width * 2.5)
    new_height = int(img.height * 2.5)
    upscaled = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    # Apply Unsharp Masking / Sharpness Enhancement
    sharpener = ImageEnhance.Sharpness(upscaled)
    sharpened = sharpener.enhance(2.3)  # Boost sharpness cleanly
    
    # Boost contrast slightly
    contraster = ImageEnhance.Contrast(sharpened)
    enhanced = contraster.enhance(1.08)
    
    # Boost color vibrancy slightly
    colorer = ImageEnhance.Color(enhanced)
    final_img = colorer.enhance(1.05)
    
    # Save back to disk with maximum PNG quality
    final_img.save(img_path, "PNG", quality=100, optimize=True)
    print(f"Successfully enhanced and upscaled image to {final_img.size[0]}x{final_img.size[1]}!")
else:
    print(f"Image not found at {img_path}")
