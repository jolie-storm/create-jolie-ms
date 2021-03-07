"use strict";

const commander = require("commander");
const prompts = require("prompts");
const fs = require("fs-extra");
const chalk = require("chalk");
const path = require("path");
const os = require("os");
const spawn = require('cross-spawn');

const packageJson = require("./package.json");
let projectName;

function init() {
  const program = new commander.Command(packageJson.name)
    .version(packageJson.version)
    .arguments("<project-directory>")
    .usage(`${chalk.green("<project-directory>")} [options]`)
    .action((name) => {
      projectName = name;
    })
    .on("--help", () => {
      console.log(
        `    Only ${chalk.green("<project-directory>")} is required.`
      );
    })
    .parse(process.argv);


    require('child_process').exec('java --version', function (error, stdout ,stderr) {
      if (error){
        console.log(chalk.bgRed("A java jdk installation is required"));
      }
      return;
    });


    require('child_process').exec('jolie --version', function (error, stdout ,stderr) {
      if (error){
        console.log(chalk.bgRed("jolie installation is required"));
        return;
      }
    });


    require('child_process').exec('yarn --version', function (error, stdout ,stderr) {
      if (error){
        console.log(chalk.bgRed("yarn installation is required"));
        return;
      }
    });
  

  if (!projectName) {
    console.log("Project Name need to be set");
  } else {
    createMs(projectName);
  }
}

function createMs(name) {
  const root = path.resolve("./" + name);
  const appName = path.basename(root);

  const packageJson = {
    name: name,
    version: "0.0.1",
    scripts: {
      postinstall: "node ./node_modules/jolie-postinstall",
    },
    "dependencies":{
      "jolie-postinstall" : "^1.0.6"
    }
    
  };


  if (!fs.existsSync(root)){
    fs.mkdirSync(root);
  }
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL
  );

}



module.exports = {
  init,
};
