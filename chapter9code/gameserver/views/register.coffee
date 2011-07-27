doctype 5
html ->
	head ->
		title "Register"
	body ->
		form action:'/register', method:'POST', ->
			div -> 
				span "Username:"
				input type:'text', name:'username'
				br ->
				span "Password:"
				input type:'password', name:'password'
				br ->
				span "Confirm Password:"
				input type:'password', name:'confirm-password'
				br ->
				button type:'submit', -> 'Create Account'
			
	
