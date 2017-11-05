require 'eslintrb/eslinttask'

def js_glob
  dirs = [
    'js/vectorscores',
    'js/vs/',
    'scores/'
  ]

  '{' + dirs.join(',') + '}**/*.js'
end

def split_file_list_by_frontmatter(glob)
  source = []
  frontmatter = []

  Dir[glob].each do |file|
    if File.open(file, &:readline) =~ /^---/
      frontmatter.push(file)
    else
      source.push(file)
    end
  end

  { source: source, frontmatter: frontmatter }
end

def write_lintable_frontmatter_files(files)
  files.each do |file|
    write_tmp_file_wo_liquid(file, '.tmp/' + file)
  end
end

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

# TODO: file init and .tmp/ creation run for all tasks
namespace :eslint do
  glob = js_glob

  files = split_file_list_by_frontmatter(glob)

  write_lintable_frontmatter_files(files[:frontmatter])

  task :info do
    puts "Linting #{files[:source].size} .js source files"
    puts "Linting #{files[:frontmatter].size} .js source files with frontmatter"
  end

  desc 'Lint source files, excluding those with front matter'
  Eslintrb::EslintTask.new source: [:info] do |t|
    t.pattern = files[:source]
    t.options = :eslintrc
  end

  desc 'Lint source files with front matter, from .tmp/'
  Eslintrb::EslintTask.new frontmatter: [:info] do |t|
    t.pattern = files[:frontmatter].map { |f| '.tmp/' + f }
    t.options = :eslintrc
  end

  desc 'Lint built files with no options to catch parsing errors'
  Eslintrb::EslintTask.new built: [:info] do |t|
    t.pattern = '_site/' + glob
  end

  task :clean do
    rm_rf '.tmp'
  end

  task all: %i[frontmatter source built clean]
end
