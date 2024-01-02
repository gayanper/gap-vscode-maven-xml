'use strict';

const path = require('path');
const fs = require('fs');
const gulp = require('gulp');
const cp = require('child_process');
const del = require('del');

gulp.task('patch_paths', (cb) => {
    const packageJsonData = require('./package.json');
    const javaExtensions = [];
    const jars = path.resolve('./extjar');
    const extFiles = fs.readdirSync(jars);
    extFiles.forEach(fpath => {
        if(fpath.endsWith('.jar')) {
            javaExtensions.push('./extjar/' + fpath.substring(fpath.lastIndexOf('/') + 1));
        }
    });
    packageJsonData.contributes['xml.javaExtensions'] = javaExtensions;
    fs.writeFileSync('./package.json', JSON.stringify(packageJsonData, null, 2));
    cb();
});


gulp.task('download-jar', (cb) => {
    del(['./extjar/*']).then(() => {
        cp.execSync('mvn clean package', { cwd: './', stdio: [0, 1, 2] });
    });
    cb();
});
