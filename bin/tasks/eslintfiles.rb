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
  def self.report(list_name, string)
    list = EslintFiles.instance_variable_get("@#{list_name}")
    puts "Linting #{list.size} #{string}"
  end

  # Get source files with frontmatter
  frontmatter_source = FileList.new(js_glob) do |fl|
    fl.exclude do |f|
      !LiquidJSFiles.contains_frontmatter?(f)
    end
  end

  # Write and return list of tmp files to lint
  @frontmatter = LiquidJSFiles.write_lintable_files(frontmatter_source)

  def self.frontmatter
    @frontmatter
  end

  @source = FileList.new(js_glob) do |fl|
    fl.exclude do |f|
      LiquidJSFiles.contains_frontmatter?(f)
    end
  end

  def self.source
    @source
  end

  @built = FileList.new('_site/' + js_glob)

  def self.built
    @built
  end
end
