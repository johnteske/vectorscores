# WebSockets

## Running WebSocket server

Serve site and run WebSocket server
`bin/start_local`

Standalone WebSocket server
`ruby bin/_websockets.rb`

## Message format
[*id*, *type*, *msg*[, *data*]]

Example (play from score event 2):
`["1b2d3f",  "vs",  "play",  2]`


### Message types

#### `ws` (WebSocket)
[*id*, *type*, *msg*[, *data*]]

- connection open
`["id", "ws", "open"]`

- number of connections
`["id", "ws", "n", "2"]`

- connection closed
`["id", "ws", closed"]`

- reload all pages
`["id", "ws", "reload"]`

#### `vs` (vectorscores)
[*id*, *type*, *msg*[, *pointer*]]

- play
`["id", "vs", "play", 0]`

- pause
`["id", "vs", "pause", 6]`

- stop
`["id", "vs", "stop"]`

- step
`["id", "vs", "step", 4]`


#### Custom messages
[*id*, *type*, *msg*[, *data* ...]]

- choice
`["id", "choice", "F#"]`
