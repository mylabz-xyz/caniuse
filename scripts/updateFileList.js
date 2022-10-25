var fs = require("fs");
var files = fs
  .readdirSync(__dirname + "/../caniuse/features-json")
  .map((fileName) => fileName.split(".")[0]);

console.log(files);
// fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
//     if (err) return console.log(err);
//     console.log(JSON.stringify(file));
//     console.log('writing to ' + fileName);
//   });
