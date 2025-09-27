# ClusterAI Landing Page

A minimal React landing page that shows a centered "Enter ClusterAI" button and loads a 3D arena on click.

## Features

- **Landing Page**: Dark theme with centered card containing title, subtitle, and enter button
- **3D Arena**: Full-screen 3D canvas with GLB model loading from Google Drive
- **Controls**: WASD + mouse look controls using PointerLockControls
- **Loading States**: Centered loading spinner while model loads
- **Error Handling**: Friendly error panel with retry functionality
- **Accessibility**: Keyboard-focusable button with proper ARIA labels

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Three.js** for 3D rendering
- **React Three Fiber** for React integration with Three.js
- **React Three Drei** for useful Three.js helpers and controls

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:3000`

## Usage

1. Click the "Enter ClusterAI" button on the landing page
2. Wait for the 3D arena to load (shows loading spinner)
3. Click anywhere in the 3D view to lock the pointer
4. Use WASD keys to move around the arena
5. Use the mouse to look around
6. Press ESC to unlock the pointer
7. Click the "Back" button to return to the landing page

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Model Source

The 3D arena model is loaded from a Google Drive GLB file:
`https://drive.google.com/uc?export=download&id=1DcjmKgArwf955QnF0qHikLh_t7wBlEte`