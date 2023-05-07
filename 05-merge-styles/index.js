const fs = require('fs');
const path = require('path');

// Путь к папке со стилями
const stylesPath = path.join(__dirname, 'styles');

// Путь к выходному файлу
const outputPath = path.join(__dirname, 'project-dist', 'bundle.css');

// Функция для чтения файла и записи его содержимого в выходной файл
const writeToFile = (filePath) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    fs.appendFile(outputPath, data, (err) => {
      if (err) throw err;
      console.log(`Added styles from ${filePath}`);
    });
  });
};

// Читаем все файлы в папке со стилями
fs.readdir(stylesPath, (err, files) => {
  if (err) throw err;
  // Очищаем выходной файл перед записью новых стилей
  fs.writeFile(outputPath, '', (err) => {
    if (err) throw err;
    console.log('Cleared output file');
    // Фильтруем только файлы с расширением .css
    const cssFiles = files.filter((file) => path.extname(file) === '.css');
    // Для каждого файла вызываем функцию записи его содержимого в выходной файл
    cssFiles.forEach((file) => {
      const filePath = path.join(stylesPath, file);
      writeToFile(filePath);
    });
  });
});