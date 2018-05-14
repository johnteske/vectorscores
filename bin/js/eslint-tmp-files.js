const mkdirp = require('mkdirp')

const fs = require('fs')
const path = require('path')
const glob = require('glob')

const root = './'

// Loop through all front-end JS files
glob(root + '{assets,scores}/**/*.js', (err, files) => {
    if (!err) {
        const frontmatterFiles = files.filter(hasFrontmatter)
        writeIgnoreFile(root + '.tmp-eslintignore', frontmatterFiles)
    }
})

/**
 * Check the first line of the file for frontmatter,
 * if true comment out the frontmatter and write to a tmp file,
 * and return true for the glob filter.
 */
function hasFrontmatter(filePath) {
    const content = fs.readFileSync(filePath).toString()
    const head = content.substring(0, 3)

    const hasFM = head === '---'

    if (hasFM) {
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

    return hasFM
}

/**
 * Write an .eslintignore file to ignore:
 * - source files with frontmatter
 * - libraries
 * - tests
 */
function writeIgnoreFile(filePath, frontmatterFiles) {
    let content = frontmatterFiles.map(f => {
            return f.replace(root, '')
        })
        .join('\n')

    // Ignore libraries
    content += '\nassets/js/lib\n'

    // Ignore tests
    content += '\n**/_tests/**/*.js\n'

    fs.writeFileSync(filePath, content)
}
