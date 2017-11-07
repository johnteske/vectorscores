desc 'Build Jekyll site'
task :jekyll_build do
  sh 'bundle exec jekyll build'
end
