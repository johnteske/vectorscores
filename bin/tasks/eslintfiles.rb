require_relative 'liquidjsfiles'

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

  def self.frontmatter_list
    files = FileList.new(js_glob) do |fl|
      fl.exclude do |f|
        !LiquidJSFiles.contains_frontmatter?(f)
      end
    end

    report(files, 'source .js files with frontmatter')

    # Write and return list of tmp files to lint
    LiquidJSFiles.write_lintable_files(files)
  end

  def self.source_list
    files = FileList.new(js_glob) do |fl|
      fl.exclude do |f|
        LiquidJSFiles.contains_frontmatter?(f)
      end
    end

    report(files, 'source .js files')

    files
  end

  def self.built_list
    files = FileList.new('_site/' + js_glob)

    report(files, 'built .js files')

    files
  end
end
