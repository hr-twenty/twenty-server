Twenty
===

### Intro

This is a public repo built by the [Twenty](https://github.com/hr-twenty) team at [Hack Reactor](http://www.hackreactor.com/)

### Twenty

Twenty is a mobile app that allows you to quickly and easily connect with professionals in your area.  Whether it's to connect with other developers to discuss pointers on the newest libraries, to find VCs to invest in your latest venture, or simply to make the most out of your layover at SFO, Twenty is the app for converting your virtual networks into physical ones.

Log in with LinkedIn to get started.  You'll see a stack of potential connections and simply swipe right to connect or swipe left to move on to the next one.  If both people swipe right, you'll get a notification and can immediately start chatting using our in-app messenger.


### Technical

Twenty uses the following technologies:
  - Angular/Ionic
  - Node
  - Express
  - Neo4j

This repo contains all code for both the Node/Express server and for the Neo4j database.

### Running
```bash
$ NODE_ENV=(production|development) node server.js
```

### Testing
```bash
$ neo4j start
$ mocha test/controllers
$ mocha test/models
```
