require 'rubocop/rake_task'

desc 'Lint Ruby files'
RuboCop::RakeTask.new :rubocop do |t|
  t.options = ['--display-cop-names']
end
