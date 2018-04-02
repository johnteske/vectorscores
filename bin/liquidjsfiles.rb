# Helpers for managing Javascript files with frontmatter and Liquid tags
module LiquidJSFiles
  def self.contains_frontmatter?(file)
    File.open(file, &:readline) =~ /^---/
  end

  def self.write_lintable_files(files)
    tmp_files = []

    files.each do |file|
      tmp_file = '.tmp/' + file
      write_file_wo_liquid(file, tmp_file)
      tmp_files.push(tmp_file)
    end

    tmp_files
  end

  def self.write_file_wo_liquid(src, dest)
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
end
