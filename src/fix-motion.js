// Автоматический фикс для motion импортов
const fs = require('fs');
const path = require('path');

const fixMotionImports = () => {
  const srcPath = path.join(__dirname);
  
  const files = fs.readdirSync(srcPath, { recursive: true });
  
  files.forEach(file => {
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const filePath = path.join(srcPath, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Заменяем импорты
      content = content.replace(
        /import\s+{([^}]+)}\s+from\s+["']motion\/react["']/g,
        'import {$1} from "framer-motion"'
      );
      
      fs.writeFileSync(filePath, content, 'utf8');
    }
  });
};

fixMotionImports();
