'use strict';

// load css right away
require('bootstrap/dist/css/bootstrap.css');
require('font-awesome/css/font-awesome.css');
require('../less/app.less');

var $ = require('jquery');
var ChatActions = require('./actions/ChatActions');
var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router');
var routes = require('./routes.jsx');

var router = Router.createRoutes({
  routes: routes,
  location: Router.HistoryLocation
});

// Hydrate the app with seed data before running
require('./hydrate')();

var node = document.getElementById('golfdraftapp');
ReactDOM.render(
  (<div className="container">
    <div className="row">
      <div className="col-md-offset-1 col-md-10">
        {routes}
      </div>
    </div>
  </div>),
  node
);


// Begin listening for live socket updates
require('./startSocketUpdates')();

// Lazily get chat messages
//
// TODO - move to separate server sync
$.getJSON('/chat/messages').success(ChatActions.setMessages);
