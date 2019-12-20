const fs = require('fs');
const path = require('path');

let arr = [];
let lineCount = 0;

const readDirectory = dir => {
  var dirContents = fs.readdirSync(dir);

  for (let i = 0; i < dirContents.length; i++) {
    var item = dirContents[i];

    if (
      item != '.git' &&
      item != 'node_modules' &&
      item != 'public' &&
      item != '.DS_Store' &&
      item != 'package-lock.json'
    ) {
      var absPath = path.resolve(dir, dirContents[i]);
      var stat = fs.lstatSync(absPath);

      if (stat.isDirectory()) {
        readDirectory(absPath);
      } else {
        var fileContent = fs.readFileSync(absPath, 'utf-8');
        var fileCount = fileContent.split('\n').length;
        arr.push({ count: fileCount, path: absPath });
        lineCount += fileCount;
      }
    }
  }
};

readDirectory(__dirname);

console.log(lineCount);
console.log(lineCount / arr.length);
