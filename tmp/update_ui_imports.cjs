const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, '..', 'src', 'apps', 'admin'),
  path.join(__dirname, '..', 'src', 'apps', 'client'),
  path.join(__dirname, '..', 'src', 'shared')
];

const replacements = [
  // UI Components - Broad relative matching
  { from: /from "[\.\/]+ui\//g, to: 'from "@shared/components/ui/' },
  { from: /from '[\.\/]+ui\//g, to: 'from "@shared/components/ui/' },
  { from: /from "[\.\/]+components\/ui\//g, to: 'from "@shared/components/ui/' },
  { from: /from '[\.\/]+components\/ui\//g, to: 'from "@shared/components/ui/' },
];

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const r of replacements) {
        if (r.from.test(content)) {
          content = content.replaceAll(r.from, r.to);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated imports in: ${fullPath}`);
      }
    }
  }
}

targetDirs.forEach(processDir);
console.log('Done.');
