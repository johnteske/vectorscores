require 'eslintrb/eslinttask'
require_relative 'eslintfiles'

namespace :eslint do
  desc 'Lint source files with front matter, from .tmp/'
  Eslintrb::EslintTask.new :frontmatter do |t|
    t.pattern = EslintFiles.frontmatter_list
    t.options = :eslintrc
  end

  desc 'Lint source files, excluding those with front matter'
  Eslintrb::EslintTask.new :source do |t|
    t.pattern = EslintFiles.source_list
    t.options = :eslintrc
  end

  desc 'Lint built files with no options to catch parsing errors'
  Eslintrb::EslintTask.new built: [:jekyll_build] do |t|
    t.pattern = EslintFiles.built_list
  end

  task :clean do
    rm_rf '.tmp'
  end

  task all: %i[frontmatter source built clean]
end
