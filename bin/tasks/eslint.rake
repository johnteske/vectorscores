require 'eslintrb/eslinttask'

js_paths = lambda {
  dirs = [
    'js/vectorscores',
    'js/vs/',
    'scores/'
  ]

  '{' + dirs.join(',') + '}**/*.js'
}.call

tmp_dir = '.tmp'

source_files = []
frontmatter_tmp_files = []

def write_tmp_file_wo_liquid(src, dest)
  # Make a directory for temp file if needed
  FileUtils.mkdir_p(File.dirname(dest))

  # Write a file without frontmatter or liquid
  File.open(dest, 'w') do |file|
    text = File.read(src)

    # Comment out front matter
    text = text.gsub(/(^---\n(.|\n)*---)/, '/*\1*/')

    # Comment out liquid tags
    text = text.gsub(/({%.*%}|{{.*}})/, '/*\1*/')

    file.puts(text)
  end
end

# Find source files with frontmatter
Dir[js_paths].each do |file|
  first_line = File.open(file, &:readline)

  if first_line =~ /^---/
    tmp_path = tmp_dir + '/' + File.path(file)

    write_tmp_file_wo_liquid(file, tmp_path)

    frontmatter_tmp_files.push(tmp_path)
  else
    source_files.push(file)
  end
end

namespace :eslint do
  task :info do
    puts "Linting #{source_files.size} .js files without frontmatter"
    puts "Linting #{frontmatter_tmp_files.size} .js files with frontmatter"
  end
end

namespace :eslint do
  desc 'Lint source files with front matter, from .tmp/'
  Eslintrb::EslintTask.new frontmatter: [:info] do |t|
    puts @test_paths
    t.pattern = frontmatter_tmp_files
    t.options = :eslintrc
  end
end

namespace :eslint do
  desc 'Lint source files, excluding those with front matter'
  Eslintrb::EslintTask.new source: [:info] do |t|
    t.pattern = source_files
    t.options = :eslintrc
  end
end

namespace :eslint do
  desc 'Lint built files with no options to catch parsing errors'
  Eslintrb::EslintTask.new built: [:info] do |t|
    t.pattern = '_site/' + js_paths
  end
end
