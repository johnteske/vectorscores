require 'em-websocket'

# TODO use paths for each piece?

EM.run {
  @clients = []

  EM::WebSocket.start(:host => '0.0.0.0', :port => '4001') do |ws|
    ws.onopen { |handshake|
      puts "WebSocket connection open"
      cid = rand(36**8).to_s(36) # generate client id
      puts "#{cid} connected to #{handshake.path}."
      @clients << ws
      ws.send "{ \"cid\":\"#{cid}\", \"type\":\"ws\", \"content\":\"connected\" }"
      puts "#{@clients.length} connections open"
    }

    ws.onclose {
      puts "Closed."
      ws.send "Closed."
      @clients.delete ws
    }

    ws.onmessage { |msg|
      puts "Received: #{msg}"
      @clients.each do |socket|
        socket.send msg
      end
    }
  end

  puts "WebSocket server running... press ctrl-c to stop."
}
