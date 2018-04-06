# Installing locally

The scripts to install and run *vectorscores* locally are run from the root directory of the project.


## Requirements
- Ruby >=2.4.1


## Set up

### 1. Clone the repository

`git clone https://github.com/johnteske/vectorscores.git` or [download ZIP](https://github.com/johnteske/vectorscores/archive/gh-pages.zip)

### 2. Install dependencies

1. Run `cd vectorscores` to navigate to the new project directory
1. Run `bin/install` to install gems

### 3. Run the server(s)

- Run `bin/serve_local` to run the web server or
- run `bin/start_local` to run both web server and WebSockets server

The WebSockets server can also be run independently. See [WebSockets](websockets.md).
