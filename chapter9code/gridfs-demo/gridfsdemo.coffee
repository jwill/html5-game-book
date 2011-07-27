sys = require 'sys'
fs = require 'fs'

mongodb = require 'mongodb'
DB = mongodb.Db
Connection = mongodb.Connection
Server = mongodb.Server
GridStore = mongodb.GridStore

host = 'localhost'
port = Connection.DEFAULT_PORT

db1 = new DB('gridfs-demo', new Server(host, port, {}), {native_parser:true})
db1.open (err,db) ->
	sys.puts 'Opened db'
	# Write a file
	gridStore = new GridStore(db, "image.png", "w", {
		'content_type': 'image/png'
	})
	gridStore.open (err, it) ->
		it.writeFile './file.png', (err, data) ->
			sys.puts err if err
			sys.puts 'Opened file and wrote to GridFS'
	
	GridStore.read db, "image.png", (err, data) ->
			sys.puts err if err
			sys.puts 'Saving file'
			fs.writeFile('file2.png', data, 'binary', (err) ->)
