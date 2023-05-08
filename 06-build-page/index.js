const path = require('path');
const fs = require('fs');
const { promises: { readFile } } = require('fs');

const targetF = path.join(__dirname, 'project-dist');

fs.rm(targetF, { recursive: true, force: true }, (err) => {
    if (err) console.log(err.message);

    fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
        if (err) console.log(err.message);
        cssBuild(path.join(__dirname, 'styles'), path.join(__dirname, 'project-dist', 'style.css'));
        copyFolder(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
        htmlReplace(path.join(__dirname, 'components'), path.join(__dirname, 'project-dist', 'index.html'));

    });

});

function copyFolder(pathSource, pathTarget) {
    fs.mkdir(pathTarget, { recursive: true }, (err) => {
        if (err) console.log(err.message);
        fs.readdir(pathSource, { withFileTypes: true }, (err, files) => {
            if (err) console.log(err.message);
            files.forEach((file) => {
                if (file.isFile()) {
                    fs.copyFile(path.join(pathSource, file.name), path.join(pathTarget, file.name), (err) => {
                        if (err) console.log(err.message);
                    });
                }
                else {
                    copyFolder(path.join(pathSource, file.name), path.join(pathTarget, file.name));
                }
            });
        });
    });
}

function cssBuild(pathSource, filePathTarget) {
    fs.readdir(pathSource, { withFileTypes: true }, (err, files) => {
        let paths = [];
        files.forEach((file) => {
            if (file.isDirectory()) return;
            if (path.extname(file.name) === '.css') paths.push(path.join(pathSource, file.name));
        });

        Promise.all(
            paths.map(filePath => {
                return readFile(filePath);
            })
        ).then((filesContentArray) => {
            let totalContent = '';
            filesContentArray.forEach((content) => {
                totalContent += content.toString() + '\n';
            });
            fs.writeFile(filePathTarget, totalContent, (err) => {
                if (err) console.log('Error while putting content in bundle.css file: ' + err.message);
            });
        }).catch((err) => {
            console.log(err.message);
            process.exit(1);
        });
    });
}

function htmlReplace(componentsFolderPath, filePathTarget) {
    fs.readdir(componentsFolderPath, { withFileTypes: true }, (err, files) => {
        let paths = [];
        files.forEach((file) => {
            if (file.isDirectory()) return;
            if (path.extname(file.name) === '.html') paths.push(path.join(componentsFolderPath, file.name));
        });

        Promise.all(
            paths.map(filePath => {
                return readFile(filePath);
            })
        ).then((filesContentArray) => {
            let contentToReplaceArray = [];
            filesContentArray.forEach((content, index) => {
                contentToReplaceArray.push({
                    tag: '{{' + path.basename(paths[index], path.extname(paths[index])) + '}}',
                    content: content.toString(),
                });
            });

            fs.readFile(path.join(__dirname, 'template.html'), (err, data) => {
                if (err) console.log(err.message);
                let rez = data.toString();

                contentToReplaceArray.forEach((el) => {
                    rez = rez.replace(el.tag, el.content);
                });

                //remove empty tags if any
                rez = rez.replace(/{{(.*?)}}/, '');

                fs.writeFile(filePathTarget, rez, (err) => {
                    if (err) console.log('Error while putting content in html target file: ' + err.message);
                });

            });
        }).catch((err) => {
            console.log(err.message);
            process.exit(1);
        });
    });
}


