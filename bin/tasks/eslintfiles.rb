# Manage Javascript file lists for linting
module EslintFiles
  def self.js_glob
    dirs = [
      'js/vectorscores',
      'js/vs/',
      'scores/'
    ]

    '{' + dirs.join(',') + '}**/*.js'
  end

  # Will log all file lists on load, not as each task is being run
  def self.report(list, string)
    puts "Linting #{list.size} #{string}"
  end

  def self.contains_frontmatter?(file)
    File.open(file, &:readline) =~ /^---/
  end

  def self.write_lintable_frontmatter_files(files)
    tmp_files = []

    files.each do |file|
      tmp_file = '.tmp/' + file
      write_tmp_file_wo_liquid(file, tmp_file)
      tmp_files.push(tmp_file)
    end

    tmp_files
  end

  def self.write_tmp_file_wo_liquid(src, dest)
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

  def self.source_list
    files = FileList.new(js_glob) do |fl|
      fl.exclude do |f|
        contains_frontmatter?(f)
      end
    end

    report(files, 'source .js files')

    files
  end

  def self.frontmatter_list
    files = FileList.new(js_glob) do |fl|
      fl.exclude do |f|
        !contains_frontmatter?(f)
      end
    end

    report(files, 'source .js files with frontmatter')

    # Write and return list of tmp files to lint
    write_lintable_frontmatter_files(files)
  end

  def self.built_list
    files = FileList.new('_site/' + js_glob)

    report(files, 'built .js files')

    files
  end
end
