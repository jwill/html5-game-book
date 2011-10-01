doctype 5
html ->
	head ->
		title "#{@title}"
		link rel: 'stylesheet', href: 'css/main.css'
		link rel: 'stylesheet', href: 'http://twitter.github.com/bootstrap/1.3.0/bootstrap.min.css'
		script src: '/nowjs/now.js'
		script src: "https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"
		script src: 'http://twitter.github.com/bootstrap/1.3.0/bootstrap-modal.js'
		# games
		script src: 'TicTacToe/TicTacToe.js'
		
	coffeescript ->
			window.saveRoomName = () ->
				roomName = $("#inputRoomName").val()
				cb = (data) -> 
					$('#roomName').get(0).innerHTML = "Room: "+roomName
					$("#create-game-modal").modal('hide')
					window.roomName = roomName

					now.startTicTacToeGame(roomName)
					console.log(data)
				now.createRoom(roomName, cb)
			
			window.getRooms = () ->
				cb = (data) ->
					console.log(roomName) for roomName, id of data
					$('#roomSelect').empty()
					$("#roomSelect").append(new Option("--Select A Room--", null));
					for roomName, id of data
						$("#roomSelect").append(new Option(roomName, roomName));
					$("#join-room-modal").modal('show')
				now.getRooms(cb)
			
			window.join = () ->	
				name = $('#roomSelect').val()			
				cb = (roomName) -> 
					window.roomName = roomName
					$('#roomName').get(0).innerHTML = "Room: "+roomName
					$("#join-room-modal").modal('hide')
				now.joinRoom(name, cb)
				console.log(name)
				
			window.toggleElement = (element, visibility) ->
				$(element).get(0).style.display = visibility
				$('#fade').get(0).style.display = visibility
				""
			window.createGame = () ->
				$("#create-game-modal").modal('show')
				
								
	body ->
		div class:'topbar', ->
			div class:'topbar-inner', ->
				div class:'container', ->
					a class:'brand', href:'#', ->'Game Server'
					ul class:'nav', ->
						li -> a id:'roomName', href:'#',-> ''
						li -> a href:'#', onclick:'javascript:createGame();',-> 'Create A Room'
						li -> a href:'#', onclick:'javascript:getRooms()',-> 'Join A Room'
		
			#button onclick:'createGame()', -> 'TicTacToe'
			
		div id: 'content', -> @body
		
		div id:'create-game-modal', class:'modal hide', ->
			div class:'modal-header', ->
				a class:'close', -> 'x'
				h3 -> 'Create A Game'
			div class:'modal-body', ->
				form ->
					div class:'clearfix', ->
						label for:'inputRoomName', -> 'Enter Room Name:'
						div class:'input', ->
							input id:'inputRoomName', class:'xlarge', size:'30', type:'text', ->
			div class:'modal-footer', ->
				button href:'#', class:'btn primary',onclick:'saveRoomName();', -> 'Create'
				button href:'#', class:'btn',-> 'Cancel'
			
		div id:'name-modal', class:'modal hide', ->
			div class:'modal-header', ->
				a class:'close', -> 'x'
			div class:'modal-body', ->
			div class:'modal-footer', ->
				button href:'#', class:'btn primary',onclick:'', -> 'Save'
				button href:'#', class:'btn',-> 'Cancel'
			
		div id:'join-room-modal', class:'modal hide', ->
			div class:'modal-header', ->
				a class:'close', -> 'x'
				h3 -> 'Join A Room'
			div class:'modal-body', ->
				form ->
					div class:'clearfix', ->
						label for:'roomSelect', -> 'Select A Room:'
						div class:'input', ->
							select id:'roomSelect', class:'normalSelect', ->

			div class:'modal-footer', ->
				button href:'#', class:'btn primary',onclick:'javascript:join();', -> 'Join'
				button href:'#', class:'btn',-> 'Cancel'
			

