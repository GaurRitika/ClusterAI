# Model Setup Instructions

## Problem: "Unexpected end of JSON input" Error

This error occurs when the GLB model file cannot be loaded properly. Here are the solutions:

## Option 1: Local File (Recommended)

1. **Place your GLB file** in the `public/models/` directory:
   ```
   public/
   └── models/
       └── soni.glb
   ```

2. **Verify the file** is a valid GLB format (not corrupted)

3. **File size**: Ensure the GLB file isn't too large (< 50MB recommended)

## Option 2: GitHub Raw URL

If you want to load from GitHub, update the URLs in `ArenaView.tsx`:

```typescript
const ARENA_MODEL_URLS = [
  '/models/soni.glb', // Local file
  'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/public/models/soni.glb',
]
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual GitHub details.

## Option 3: GitHub LFS (Large File Storage)

For large GLB files, use GitHub LFS:

1. Install Git LFS: `git lfs install`
2. Track GLB files: `git lfs track "*.glb"`
3. Add and commit: `git add .gitattributes && git commit -m "Track GLB files with LFS"`
4. Use the LFS URL format in your code

## Troubleshooting

1. **Check browser console** for specific error messages
2. **Verify file path** matches exactly (case-sensitive)
3. **Test file access** by visiting the URL directly in browser
4. **Check CORS headers** if loading from external source
5. **Validate GLB file** using online GLB viewers

## Current Configuration

The app will try these URLs in order:
1. `/models/soni.glb` (local file)
2. GitHub raw URLs (if configured)

If all fail, it shows an error panel with retry option.