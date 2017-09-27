# TODO use paths for each piece

require 'em-websocket'
require 'json'

module MyKeyboardHandler
  include EM::Protocols::LineText2

  def initialize(c)
    @clients = c
  end

  def receive_line data
    if data =~ /reload/i
      msg = ["ws", "", "reload"].to_json

      @clients.each do |socket|
        socket.send msg
      end
    end
  end

end

EM.run {
  @clients = []

  # Update all clients with number of total connections
  def sendNConnections(cid = nil)
      puts "#{@clients.length} connections open"

      msg = ["ws", cid, "n", @clients.length].to_json

      @clients.each do |socket|
        socket.send msg
      end
  end

  EM::WebSocket.start(:host => '0.0.0.0', :port => '4001') do |ws|
    ws.onopen { |handshake|
      puts "WebSocket connection open"
      cid = rand(36**8).to_s(36) # generate client id
      puts "#{cid} connected to #{handshake.path}."

      @clients << ws

      ws.send ["ws", cid, "connected"].to_json

      sendNConnections(cid)
    }

    ws.onclose {
      puts "Closed."
      ws.send ["ws", "", "closed"].to_json
      @clients.delete ws
      sendNConnections()
    }

    ws.onmessage { |msg|
      puts "Received: #{msg}"
      @clients.each do |socket|
        socket.send msg
      end
    }
  end

  EM.open_keyboard(MyKeyboardHandler, @clients)

  puts "WebSocket server running... press ctrl-c to stop."
}
