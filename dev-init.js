const fs = require("fs");
const process = require("process");

let updating = false;

if (!fs.existsSync("demo")) fs.mkdirSync("demo");
else updating = true;

process.chdir("demo");

fs.writeFileSync(
  "webpack.config.js",
  `const path = require('path');
  module.exports = {
    mode: 'development',
    entry: path.join(__dirname, 'js', 'main.js'),
    output: {
      path: path.resolve(__dirname, 'demo-app'),
      filename: "bundle.js"
    }
  };`
);

fs.writeFileSync(
  "tsconfig.json",
  `{
  "compilerOptions": {
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "target": "ES5",
      "lib": [
          "DOM",
          "ES2020"
      ],
      "module": "CommonJS",
      "outDir": "js"
  }
}`
);

if (updating) process.exit();

fs.mkdirSync("ts");
fs.mkdirSync("js");
fs.writeFileSync("ts/main.ts", "");
fs.mkdirSync("demo-app");

process.chdir("demo-app");
fs.writeFileSync(
  "index.html",
  `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="bundle.js" defer></script>
    <link rel="stylesheet" href="styles.css" />
    <title>Sandbox</title>
  </head>

  <body>
    <!-- Demo goes here! -->
  </body>
</html>
`
);

fs.writeFileSync("styles.css", "");
