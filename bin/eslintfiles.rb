require 'rake' # TODO: need rake to use FileList
require_relative 'liquidjsfiles'

# Manage Javascript file lists for linting
def js_glob
  dirs = [
    'assets/js/',
    'scores/'
  ]

  '{' + dirs.join(',') + '}**/*.js'
end

# Get source files with frontmatter
frontmatter_source = FileList.new(js_glob) do |fl|
  fl.exclude do |f|
    !LiquidJSFiles.contains_frontmatter?(f)
  end
end

# Write and return list of tmp files to lint
LiquidJSFiles.write_lintable_files(frontmatter_source)

# Write a file without frontmatter or liquid
File.open('.tmp-eslintignore', 'w') do |file|
  gitignore = File.read('.gitignore')
  file.puts(gitignore)

  file.puts('# Frontmatter source files')
  file.puts(frontmatter_source)
end
