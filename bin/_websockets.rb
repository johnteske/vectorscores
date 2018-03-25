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

  def self.add(websocket)
    @clients << websocket
  end

  def self.remove(websocket)
    @clients.delete websocket
  end

  def self.send_each(msg)
    @clients.each do |websocket|
      websocket.send msg
    end
  end

  def self.send_n_connections(cid)
    puts "#{@clients.length} connections open"

    msg = [cid, 'ws', 'n', @clients.length].to_json

    send_each(msg)
  end
end

EM.run do
  EM::WebSocket.start(host: '0.0.0.0', port: '4001') do |ws|
    ws.onopen do |handshake|
      cid = ws.object_id

      ws.send [cid, 'ws', 'connected'].to_json
      puts "WebSocket connection opened: #{cid} connected to #{handshake.path}."

      WebSocketClients.add(ws)
      WebSocketClients.send_n_connections(cid)
    end

    ws.onclose do
      cid = ws.object_id

      ws.send [cid, 'ws', 'closed'].to_json
      puts "WebSocket connection closed: #{cid}"

      WebSocketClients.remove(ws)
      WebSocketClients.send_n_connections(cid)
    end

    ws.onmessage do |msg|
      puts "Received: #{msg}"

      WebSocketClients.send_each(msg)
    end
  end

  EM.open_keyboard(KeyboardHandler)

  puts 'WebSocket server running... press ctrl-c to stop.'
end
