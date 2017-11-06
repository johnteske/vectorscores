require 'eslintrb/eslinttask'
require_relative 'eslintfiles'

namespace :eslint do
  desc 'Lint source files with front matter, from .tmp/'
  Eslintrb::EslintTask.new frontmatter: 'report:frontmatter' do |t|
    t.pattern = EslintFiles.frontmatter
    t.options = :eslintrc
  end

  desc 'Lint source files, excluding those with front matter'
  Eslintrb::EslintTask.new source: 'report:source' do |t|
    t.pattern = EslintFiles.source
    t.options = :eslintrc
  end

  desc 'Lint built files with no options to catch parsing errors'
  Eslintrb::EslintTask.new built: [:jekyll_build, 'report:built'] do |t|
    t.pattern = EslintFiles.built
  end

  task :clean do
    rm_rf '.tmp'
  end

  task all: %i[frontmatter source built clean]
end

namespace :report do
  task :frontmatter do
    EslintFiles.report('frontmatter', 'source .js files with frontmatter')
  end

  task :source do
    EslintFiles.report('source', 'source .js files')
  end

  task :built do
    EslintFiles.report('built', 'built .js files')
  end
end
