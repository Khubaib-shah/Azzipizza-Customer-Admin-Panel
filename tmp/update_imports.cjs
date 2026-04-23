const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, '..', 'src', 'apps', 'admin'),
  path.join(__dirname, '..', 'src', 'apps', 'client'),
  path.join(__dirname, '..', 'src', 'shared') // also process shared context if it has old imports
];

const replacements = [
  // Core Utils
  { from: /@admin\/lib\/utils/g, to: '@shared/lib/utils' },
  { from: /import { cn } from "@admin\/lib\/utils"/g, to: 'import { cn } from "@shared/lib/utils"' },
  
  // UI Components - Admin (Shadcn style)
  { from: /@\/components\/ui\//g, to: '@shared/components/ui/' },
  { from: /@admin\/components\/ui\//g, to: '@shared/components/ui/' },
  
  // UI Components - Relative (Universal)
  { from: /from "[\.\/]+components\/ui\//g, to: 'from "@shared/components/ui/' },
  { from: /from '[\.\/]+components\/ui\//g, to: 'from "@shared/components/ui/' },
  
  // Specifically fix client's Button default import
  { from: /import Button from "@shared\/components\/ui\/Button"/g, to: 'import { Button } from "@shared/components/ui/button"' },
  { from: /import Button from '@shared\/components\/ui\/Button'/g, to: 'import { Button } from "@shared/components/ui/button"' },
  
  // Context
  { from: /from "[\.\/]+context\/dataContext"/g, to: 'from "@shared/context/dataContext"' },
  { from: /from '[\.\/]+context\/dataContext'/g, to: 'from "@shared/context/dataContext"' },
  
  // Config
  { from: /from "[\.\/]+config\/config"/g, to: 'from "@shared/config/api"' },
  { from: /from '[\.\/]+config\/config'/g, to: 'from "@shared/config/api"' },
  
  // Utils (Domain specific)
  { from: /from "[\.\/]+utils\//g, to: 'from "@shared/utils/' },
  { from: /from '[\.\/]+utils\//g, to: 'from "@shared/utils/' },
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
