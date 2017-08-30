# TODO use paths for each piece

require 'em-websocket'

module MyKeyboardHandler
  include EM::Protocols::LineText2

  def initialize(c)
    @clients = c
  end

  def receive_line data
      if data =~ /reload/i
          @clients.each do |socket|
            socket.send "{ \"type\":\"ws\", \"content\":\"reload\" }"
          end
      end
  end
end

EM.run {
  @clients = []

  # Update all clients with number of total connections
  def sendNConnections(cid = nil)
      puts "#{@clients.length} connections open"
      @clients.each do |socket|
        socket.send "{ \"cid\":\"#{cid}\", \"type\":\"ws\", \"content\":\"connections\", \"connections\":\"#{@clients.length}\" }"
      end
  end

  EM::WebSocket.start(:host => '0.0.0.0', :port => '4001') do |ws|
    ws.onopen { |handshake|
      puts "WebSocket connection open"
      cid = rand(36**8).to_s(36) # generate client id
      puts "#{cid} connected to #{handshake.path}."
      @clients << ws
      ws.send "{ \"cid\":\"#{cid}\", \"type\":\"ws\", \"content\":\"connected\" }"
      sendNConnections(cid)
    }

    ws.onclose {
      puts "Closed."
      ws.send "Closed."
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
