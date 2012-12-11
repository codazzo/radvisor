## What it is
This application offers two things:

* A RESTful interface to [ResidentAdvisor](http://www.residentadvisor.net)
* A mobile UI to ResidentAdvisor which uses the interface

## The technology
* The API runs on Node.js + Express. Pages are scraped with [jsdom](https://github.com/tmpvar/jsdom) and jQuery. A caching layer is provided by MongoDB.
* The mobile UI is built with jQuery Mobile and Backbone.js


## Prerequisites
Install npm, node, mongo. Clone the repo locally, then `npm install` will install all the other dependencies.


## Running the app
* Launch mongo (`mongod`)
* Launch the app with (`node app`)

## Can I haz?
Point your mobile browser to [http://radvisor.net](http://radvisor.net) and play.
**WARNING** this is still in alpha stage. Suggestions and forks are welcome!
