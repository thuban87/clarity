---
description: Build and deploy Clarity plugin to Obsidian vault
---

# Build and Deploy Clarity

This workflow builds the Clarity plugin and deploys it to the Obsidian vault.

## Quick Commands

// turbo-all

### 1. Build and Deploy (One-time)
```bash
npm run dev
```
This builds the plugin and copies `main.js`, `manifest.json`, and `styles.css` to the vault.

### 2. Watch Mode (Development)
```bash
npm run watch
```
This watches for file changes and rebuilds automatically. You'll need to manually deploy after changes with:
```bash
npm run deploy
```

### 3. Production Build
```bash
npm run build
```
This runs TypeScript checks and creates an optimized production build.

### 4. Deploy Only (No Build)
```bash
npm run deploy
```
Copies the current build files to the vault without rebuilding.

## Deploy Target
```
G:\My Drive\IT\Obsidian Vault\My Notebooks\.obsidian\plugins\clarity\
```

## Files Deployed
- `main.js` - Compiled plugin code
- `manifest.json` - Plugin metadata
- `styles.css` - Plugin styles

## After Deploying
1. Open Obsidian
2. Go to Settings → Community plugins
3. Find "Clarity" and enable it (or reload if already enabled)
4. Use Ctrl+P → "Clarity: Reframe This" or click the compass icon
