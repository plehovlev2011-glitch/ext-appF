// Этот скрипт заменит ВСЕ проблемные импорты
const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Заменяем motion/react на framer-motion
  content = content.replace(/from ['"]motion\/react['"]/g, 'from "framer-motion"');
  
  // Удаляем ВСЕ figma:asset импорты
  content = content.replace(/import\s+\w+\s+from\s+['"]figma:asset\/[^'"]+['"];?\n?/g, '');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed:', filePath);
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  });
}

// Запускаем для всей папки src
processDirectory('./src');
