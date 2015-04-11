var ctx, bgImage, then, canvas, player
var keysDown = {}
var bgReady = false
var playersArray = []
var socket = io()

function Player() {
  this.name = "",
  this.image = new Image(),
  this.image.src = "/images/hero.png"
  this.speed = 256,
  this.coordinates = {x: 0, y: 0}
}

function addPlayer(player) {
  playersArray.push(player)
  socket.emit('addPlayer', player.name)
}

socket.on('addPlayer', function(playerName){
  var p = new Player()
  p.name = playerName
  reset(p)
  playersArray.push(p)
})

function reset(player) {
  player.coordinates.x = canvas.width / 3
  player.coordinates.y = canvas.height / 3
}

function update(modifier, player) {
  (function(player){
    if(37 in keysDown && player.coordinates.x > 32) { player.coordinates.x -= player.speed * modifier }
    if(38 in keysDown && player.coordinates.y > 32) { player.coordinates.y -= player.speed * modifier }
    if(39 in keysDown && player.coordinates.x < canvas.width - 64) { player.coordinates.x += player.speed * modifier }
    if(40 in keysDown && player.coordinates.y < canvas.height - 64) { player.coordinates.y += player.speed * modifier }
  })(player)
}

function broadcastPosition(player) {
  setInterval(function() {
    socket.emit('playerPosition', {name: player.name, coordinates: player.coordinates})
  }, 15)
}

function syncPosition(playersArray) {
  setInterval(function() {
    socket.on('playerPosition', function(moveInfo) {
      var ran = false
      for(person in playersArray) {
        if(playersArray[person].name == moveInfo.name) {
          playersArray[person].coordinates = moveInfo.coordinates
          ran = true
          break
        }
      }
      if(ran === false) {
        console.log('yo')
        var p = new Player()
        p.name = moveInfo.name
        reset(p)
        playersArray.push(p)
      }
    })
  }, 15)
}

function render() {
  ctx.drawImage(bgImage, 0, 0)
  // ctx.drawImage(player.image, player.coordinates.x, player.coordinates.y)
  for(person in playersArray) {
    ctx.drawImage(
      playersArray[person].image,
      playersArray[person].coordinates.x,
      playersArray[person].coordinates.y
    )
  }

  ctx.fillStyle = "rgb(250, 250, 250)"
  ctx.font = "24px Inconsolata"
  ctx.textAlign = "left"
  ctx.textBaseline = "top"
}

function main() {
  requestAnimationFrame(main)
  var now = Date.now();
  if(then) {
    var delta = now - then;
    update(delta / 1000, player);
    render();
  }
  then = now;
}

window.onload = function() {
  var namePrompt = prompt('enter name')
  player = new Player()
  player.name = namePrompt
  bgImage = new Image()
  bgImage.src = "/images/background.png"
  addPlayer(player)
  canvas = $('#canvas')[0]
  ctx = canvas.getContext("2d")

  $(document).keydown(function(e) {
    keysDown[e.keyCode] = true
  })

  $(document).keyup(function(e) {
    delete keysDown[e.keyCode]
  })
  reset(player)
  broadcastPosition(player)
  syncPosition(playersArray)
  main(player)
  // setInterval(function(){
  //   for(i in playersArray){
  //     console.log(playersArray[i])
  //   }
  // }, 1000)
}
