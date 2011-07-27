doctype 5
html ->
	head ->
		title "#{@title}"
		script src: '/nowjs/now.js'
		script src: '/js/zepto.min.js'
    	
    			
	body ->
		div id: 'content', ->
  			@body

		coffeescript ->
			
        

