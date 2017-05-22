## Contributing

Site built with Jekyll and GitHub pages.
View and develop the site locally with Jekyll using:

`$ jekyll serve` or
`$ JEKYLL_ENV=offline jekyll serve`

#### Debug mode

Reduce HTML compression for debugging with:

`$ JEKYLL_ENV=debug jekyll serve`

#### Serving on a local network

To view pages on devices on the same network, use:

`$ jekyll serve --host 0.0.0.0` or
`$ JEKYLL_ENV=offline jekyll serve --host 0.0.0.0`

and point your mobile device to your computer's private IP address, port 4000.

[More information](http://stackoverflow.com/questions/28068378/how-to-access-localhost-on-mobile-when-using-jekyll)

#### Ensuring compatibility with GitHub pages

`$ bundle exec jekyll serve`

#### Linting built files

`npm install -g eslint`

`eslint _site`
