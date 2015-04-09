var express = require('express');
var router = express.Router();
module.exports = function(io){
  var router = express.Router();

  io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  });

  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

  return router;
}
