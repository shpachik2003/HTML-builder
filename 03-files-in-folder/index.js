const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

const printFileInfo = (file) => {
  const stats = fs.statSync(file);
  const fileSizeInBytes = stats.size;
  const fileSizeInKb = fileSizeInBytes / 1024;

  console.log(
    `${path.parse(file).name}-${path.parse(file).ext.slice(1)}-${fileSizeInKb.toFixed(3)}kb`
  );
};

const readDirectory = (dir) => {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const fileStats = fs.statSync(filePath);

      if (fileStats.isFile()) {
        printFileInfo(filePath);
      } else if (fileStats.isDirectory()) {
        readDirectory(filePath);
      }
    });
  });
};

readDirectory(dirPath);