const mkdirp = require('mkdirp')

const fs = require('fs')
const path = require('path')
const glob = require('glob')

const root = './'

// Loop through all front-end JS files
glob(root + '{assets,scores}/**/*.js', (err, files) => {
    if (!err) {
        const frontmatterFiles = files.filter(hasFrontmatter)
        frontmatterFiles.forEach(writeTmpFileWithoutFrontmatter)
        writeIgnoreFile(root + '.tmp-eslintignore', frontmatterFiles)
    }
})

function hasFrontmatter(filePath) {
    const content = fs.readFileSync(filePath).toString()
    const head = content.substring(0, 3)
    return head === '---'
}

/**
 * Comment out the frontmatter and write to a tmp file
 */
const writeTmpFileWithoutFrontmatter = filePath => {
    const content = fs.readFileSync(filePath).toString()

    const contentNoFM = content
        .replace(/(^---\n(.|\n)*---)/g, '/*$1*/')
        .replace(/({%.*%}|{{.*}})/g, '/*$1*/')

    const tmpPath = filePath.replace(root, root + '.tmp/')

    try {
        mkdirp.sync(path.dirname(tmpPath))
        fs.writeFileSync(tmpPath, contentNoFM)
    } catch (err) {
        throw new Error(err)
    }
}

/**
 * Write an .eslintignore file to ignore:
 * - source files with frontmatter
 * - libraries
 * - tests
 */
function writeIgnoreFile(filePath, frontmatterFiles) {
    let content = [].concat(
        frontmatterFiles.map(f => f.replace(root, '')),
        'assets/js/lib',
        '**/_tests/**/*.js',
        ''
    )
    .join('\n')

    fs.writeFileSync(filePath, content)
}
