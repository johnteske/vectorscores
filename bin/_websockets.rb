# TODO: use paths for each piece

require 'em-websocket'
require 'json'

# Handle user input while server is running
module KeyboardHandler
  include EM::Protocols::LineText2

  def receive_line(data)
    return unless data =~ /reload/i

    msg = ['', 'ws', 'reload'].to_json

    WebSocketClients.send_each(msg)
  end
end

# Manage list of WebSocket clients
module WebSocketClients
  @clients = []

  def self.add(ws)
    @clients << ws
  end

  def self.remove(ws)
    @clients.delete ws
  end

  # Generate a unique id, referred to as the cid
  # TODO: returns a random (not truly unique) id,
  # which creates a very low chance of having duplicate ids
  def self.generate_id
    rand(36**8).to_s(36)
  end

  def self.send_each(msg)
    @clients.each do |socket|
      socket.send msg
    end
  end

  def self.send_n_connections(cid = nil)
    puts "#{@clients.length} connections open"

    msg = [cid, 'ws', 'n', @clients.length].to_json

    send_each(msg)
  end
end

EM.run do
  EM::WebSocket.start(host: '0.0.0.0', port: '4001') do |ws|
    ws.onopen do |handshake|
      cid = WebSocketClients.generate_id
      puts "WebSocket connection opened: #{cid} connected to #{handshake.path}."

      WebSocketClients.add(ws)

      ws.send [cid, 'ws', 'connected'].to_json

      WebSocketClients.send_n_connections(cid)
    end

    ws.onclose do
      puts 'WebSocket connection closed.'
      ws.send ['', 'ws', 'closed'].to_json
      WebSocketClients.remove(ws)
      WebSocketClients.send_n_connections
    end

    ws.onmessage do |msg|
      puts "Received: #{msg}"
      WebSocketClients.send_each(msg)
    end
  end

  EM.open_keyboard(KeyboardHandler)

  puts 'WebSocket server running... press ctrl-c to stop.'
end
