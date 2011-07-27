doctype 5
html ->
	head ->
    	title "#{@title || 'NowJS Demo'}"
    	script src: '/nowjs/now.js'

	body ->
		@body
