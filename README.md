# NOTEKRAFT 📚

A comprehensive digital note-taking and study management Progressive Web App (PWA).

## 🛠️ Project Setup Steps

### Initial Directory and File Creation

The following command was used to set up the complete project structure:

```powershell
mkdir assets, assets/icons, becf, maths, dld, python -Force; New-Item -ItemType File -Path index.html, manifest.json, sw.js, assets/styles.css, assets/app.js, README.md, becf/index.html, maths/index.html, dld/index.html, python/index.html -Force
```

### What This Command Does:

1. **Creates Directories:**
   - `assets/` - For stylesheets, scripts, and other assets
   - `assets/icons/` - For app icons and images
   - `becf/` - Business Environment and Corporate Finance notes
   - `maths/` - Mathematics notes
   - `dld/` - Digital Logic Design notes
   - `python/` - Python programming notes

2. **Creates Files:**
   - `index.html` - Main landing page
   - `manifest.json` - PWA manifest file
   - `sw.js` - Service worker for offline functionality
   - `assets/styles.css` - Global stylesheets
   - `assets/app.js` - Main JavaScript functionality
   - `README.md` - This documentation file
   - `becf/index.html` - BECF subject page
   - `maths/index.html` - Mathematics subject page
   - `dld/index.html` - DLD subject page
   - `python/index.html` - Python subject page

### Final Project Structure:

```
NOTEKRAFT/
├── index.html              # Main landing page
├── manifest.json           # PWA manifest file
├── sw.js                   # Service worker
├── README.md              # Project documentation
├── assets/
│   ├── styles.css         # Global styles
│   ├── app.js            # Main JavaScript
│   └── icons/            # App icons directory
├── becf/
│   └── index.html        # BECF subject notes
├── maths/
│   └── index.html        # Mathematics notes
├── dld/
│   └── index.html        # Digital Logic Design notes
└── python/
    └── index.html        # Python programming notes
```

### PowerShell Command Breakdown:

- `mkdir` - Creates directories
- `-Force` - Creates parent directories if they don't exist
- `New-Item -ItemType File` - Creates empty files
- `-Path` - Specifies file paths to create
- Comma-separated values allow multiple items in one command

### Next Steps:

1. Edit `index.html` to create the main navigation
2. Update `manifest.json` with PWA configuration
3. Implement service worker in `sw.js`
4. Add styling to `assets/styles.css`
5. Add functionality to `assets/app.js`
6. Create content for each subject's `index.html`

---

*Project initialized on: September 28, 2025*
*Environment: Windows PowerShell 5.1*