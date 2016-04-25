Coordinator design:
* Coordinate object state:
	* Content location map
      	* Map content_hash to lists of peer-ids
    * Client map
      	* Map peer-ids to lists of stored content_hash
  	* One socket per client
  		* pid = socket.id
* Protocol enpoints:
	* lookup(obj1_hash)
		* responds peer_id that client to connect to
	* initiate()
		* generate a pid for that user
		* responds with that pid
	* connect(pid1, pid2)
		* pid1: pid of the user it wants to connect to
		* wtf happens in here lel
	* update(pid1, obj1_hash)
		* updates content location map and client maps accordingly
		* responds with success true/false
* Other responsibilities: 
	* Sends heartbeats to all rooms
		* If no response in timeout: delete corresponding entries in maps

    // "start": "cp $MAYGH_HOME/src/client/client.js $MAYGH_HOME/example-site/public/js/maygh-client.js && cd $MAYGH_HOME/src/coordinator && npm install && npm start & cd $MAYGH_HOME/example-site && node server.js",
