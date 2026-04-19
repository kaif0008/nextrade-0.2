const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles(publicDir);

files.forEach(file => {
  const ext = path.extname(file);
  if (ext !== '.html' && ext !== '.js') return;
  if (file.endsWith('config.js')) return; // Skip the config file itself

  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. Inject config.js in HTML files
  if (ext === '.html') {
    if (!content.includes('js/config.js')) {
      // Insert in head before other scripts, or at the start of body scripts
      if (content.includes('<head>')) {
        content = content.replace('<head>', '<head>\n  <script src="js/config.js"></script>');
        changed = true;
      } else {
        content = '<script src="js/config.js"></script>\n' + content;
        changed = true;
      }
    }
  }

  // 2. Normalize fetch calls
  // Replace fetch('/api/ with fetch(CONFIG.API_BASE_URL + '/api/
  // Handle both single and double quotes, and optional leading slash
  const fetchRegex = /fetch\((\'|\")\/?api\//g;
  if (fetchRegex.test(content)) {
    content = content.replace(fetchRegex, (match, quote) => `fetch(CONFIG.API_BASE_URL + ${quote}/api/`);
    changed = true;
  }

  // 3. Normalize io() calls
  if (content.includes('io()')) {
    content = content.replace(/io\(\)/g, 'io(CONFIG.API_BASE_URL)');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
  }
});
