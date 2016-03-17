TODO
----

* Coordinator
  * Communication with clients
    * Act as protocol server for inter-client communication
    * Handle update requests
    * Handle lookup requests
      * Use geo-IP database?
  * State
    * Content location map
      * Map content to lists of peer-ids
    * Client map
      * Map peer-ids to lists of stored content
  * Upload limits
    * Track bytes downloaded and uploaded
    * Cap upload using upload_ratio
    * Cap upload using upload_max
  * (maybe) Multiple coordinators
    * Make content location map distributed using consistent hashing
    * Augment client map to include connected coordinator-id
    * Inter-coordinator communication
      * Initalization
        * Each coordinator should know which content hashes each other
          coordinator will store
      * lookup requests (whose results need to be cached)
      * Handle lookup requests
      * Use lookup request cache to initialize inter-client
        communication for clients connected to other coordinators
* Client
  * Persistent storage
  * Communication with other browsers: WebRTC or RTMFP
    * Load content from another client
    * Fallback option if content not found
    * Fallback option if client is malicious or uncooperative
  * Communication with coordinator: WebRTC or RTMFP
    * connection initialization (maygh.connect())
    * update requests 
    * lookup requests (maygh.load())
    * requests to connect to another client
* Tests
  * Spoof website with Maygh client code, perhaps using a fake
    RPC library
  * Single coordinator
  * (maybe) Multiple coordinators
  * (maybe) Malicious clients
