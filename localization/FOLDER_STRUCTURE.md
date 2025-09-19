# Localization System Folder Structure

## Overview
This document outlines the structure and organization of the localization system for the Marln Corporation website.

## Root Structure
```
localization/
├── README.md                    # Main documentation
├── FOLDER_STRUCTURE.md         # This file - folder structure documentation
├── index.js                    # Main entry point and initialization
├── simple-toggle.js            # Simple language toggle implementation
├── core/                       # Core localization engine
├── components/                 # UI components
├── config/                     # Configuration files
├── utils/                      # Utility functions
├── styles/                     # CSS stylesheets
└── languages/                  # Language data files
```

## Detailed Structure

### 📁 Core (`core/`)
Contains the main localization engine that handles language switching, RTL support, and text replacement.

- **`localization-engine.js`** (20KB, 700 lines)
  - Main localization engine class
  - Handles language detection and switching
  - Manages RTL (Right-to-Left) text direction
  - Text replacement and interpolation
  - Performance optimization features

### 📁 Components (`components/`)
UI components for language switching and user interaction.

- **`language-toggle.js`** (13KB, 460 lines)
  - Language toggle button component
  - Dropdown menu for language selection
  - Visual feedback and animations
  - Accessibility features

### 📁 Configuration (`config/`)
Configuration files for supported languages and system settings.

- **`settings.js`** (5.0KB, 223 lines)
  - Localization system configuration
  - Performance settings
  - UI behavior options
  - Feature flags

- **`supported-languages.js`** (4.1KB, 185 lines)
  - List of supported languages
  - Language metadata (name, code, direction)
  - RTL language detection
  - Language fallback logic

### 📁 Utilities (`utils/`)
Helper functions and utilities for the localization system.

- **`dom-helpers.js`** (10KB, 308 lines)
  - DOM manipulation utilities
  - Element selection helpers
  - Attribute management
  - Event handling utilities

- **`performance-monitor.js`** (10KB, 319 lines)
  - Performance monitoring tools
  - Execution time tracking
  - Memory usage monitoring
  - Performance optimization suggestions

### 📁 Styles (`styles/`)
CSS stylesheets for the localization UI components.

- **`language-toggle.css`** (8.2KB, 393 lines)
  - Language toggle button styling
  - Dropdown menu appearance
  - Responsive design rules
  - Theme integration styles

### 📁 Languages (`languages/`)
JSON files containing translated text content.

- **`en.json`** (44KB, 711 lines)
  - English language content
  - All website text in English
  - Organized by page and section

- **`ar.json`** (58KB, 711 lines)
  - Arabic language content
  - All website text in Arabic
  - RTL text direction support
  - Cultural adaptations

## File Sizes and Complexity

| Component | Size | Lines | Complexity |
|-----------|------|-------|------------|
| **Core Engine** | 20KB | 700 | High |
| **Language Toggle** | 13KB | 460 | Medium |
| **Main Entry** | 12KB | 450 | Medium |
| **Simple Toggle** | 13KB | 381 | Low |
| **Performance Monitor** | 10KB | 319 | Medium |
| **DOM Helpers** | 10KB | 308 | Low |
| **Language Toggle CSS** | 8.2KB | 393 | Low |
| **Settings** | 5.0KB | 223 | Low |
| **Supported Languages** | 4.1KB | 185 | Low |
| **English Content** | 44KB | 711 | High |
| **Arabic Content** | 58KB | 711 | High |

## Usage Patterns

### Entry Points
- **`index.js`** - Main initialization for complex applications
- **`simple-toggle.js`** - Lightweight implementation for simple sites

### Core Features
- Multi-language support (English, Arabic)
- RTL text direction support
- Performance monitoring
- DOM manipulation utilities
- Responsive UI components

### Configuration
- Easy language addition
- Customizable settings
- Performance tuning options
- UI behavior customization

## Dependencies
- Modern JavaScript (ES6+)
- CSS3 for styling
- No external libraries required
- Compatible with all modern browsers

## Maintenance Notes
- Language files should be updated when content changes
- Performance monitoring can be disabled in production
- CSS can be customized to match site theme
- New languages can be added by following the existing pattern 