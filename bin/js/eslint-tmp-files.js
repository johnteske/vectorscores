var mkdirp = require('mkdirp');

var fs = require('fs');
var path = require('path');
var glob = require('glob');

var root = './';

// Loop through all front-end JS files
glob(root + '{assets,scores}/**/*.js', function(err, files) {
    if (!err) {
        var frontmatterFiles = files.filter(hasFrontmatter);
        writeIgnoreFile(root + '.tmp-eslintignore', frontmatterFiles);
    }
});

/**
 * Check the first line of the file for frontmatter,
 * if true comment out the frontmatter and write to a tmp file,
 * and return true for the glob filter.
 */
function hasFrontmatter(filePath) {
    var content = fs.readFileSync(filePath).toString();
    var head = content.substring(0, 3);

    var hasFM = head === '---';

    if (hasFM) {
        var contentNoFM = content
            .replace(/(^---\n(.|\n)*---)/g, '/*$1*/')
            .replace(/({%.*%}|{{.*}})/g, '/*$1*/');

        var tmpPath = filePath.replace(root, root + '.tmp/');

        try {
            mkdirp.sync(path.dirname(tmpPath));
            fs.writeFileSync(tmpPath, contentNoFM);
        } catch (err) {
            throw new Error(err);
        }
    }

    return hasFM;
}

/**
 * Write an .eslintignore file to ignore source files with frontmatter
 * and d3 library
 */
function writeIgnoreFile(filePath, frontmatterFiles) {
    var content = frontmatterFiles.map(function(f) {
            return f.replace(root, '');
        })
        .join('\n');

    // Ignore d3
    content += '\nassets/js/d3*\n';

    fs.writeFileSync(filePath, content);
}
