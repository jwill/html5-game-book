doctype 5
html ->
	head ->
    	title "#{@title || 'Sockets Hello World'}"
    	script src: '/js/socket.js'

	body ->
  		div id: 'content', ->
  			@body

  		coffeescript ->
  			socket = new io.Socket 'localhost'
  			socket.connect()
  			socket.on 'connection', ->
           console.log 'Connected.'
  			socket.on 'message', (data)->
  				      console.log data
        socket.send "asdf"