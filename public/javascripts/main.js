var ctx, bgImage, then, canvas, player, other
var keysDown = {}
var bgReady = false

var socket = io()

var hero = {
  image: new Image(),
  speed: 256,
  coordinates: {"x": 0, "y": 0}
}

var asshole = {
  image: new Image(),
  speed: 256,
  coordinates: {"x": 0, "y": 0}
}

function reset() {
  hero.coordinates.x = canvas.width / 3
  hero.coordinates.y = canvas.height / 3
  asshole.coordinates.x = canvas.width / 1.5
  asshole.coordinates.y = canvas.height / 1.5

}

function update(modifier) {
  (function(player){
    if(37 in keysDown && player.coordinates.x > 32) { player.coordinates.x -= player.speed * modifier }
    if(38 in keysDown && player.coordinates.y > 32) { player.coordinates.y -= player.speed * modifier }
    if(39 in keysDown && player.coordinates.x < canvas.width - 64) { player.coordinates.x += player.speed * modifier }
    if(40 in keysDown && player.coordinates.y < canvas.height - 64) { player.coordinates.y += player.speed * modifier }
  })(player)
}

function broadcastPosition(player) {
  setInterval(function() { socket.emit('playerPosition', player.coordinates) }, 15)
}

function syncPosition(otherPlayer) {
  setInterval(function() {
    socket.on('playerPosition', function(coordinates) {
      otherPlayer.coordinates = coordinates
    })
  }, 15)
}

function render() {
  ctx.drawImage(bgImage, 0, 0)
  ctx.drawImage(hero.image, hero.coordinates.x, hero.coordinates.y)
  ctx.drawImage(asshole.image, asshole.coordinates.x, asshole.coordinates.y)

  ctx.fillStyle = "rgb(250, 250, 250)"
  ctx.font = "24px Inconsolata"
  ctx.textAlign = "left"
  ctx.textBaseline = "top"
}

function main(player) {
  requestAnimationFrame(main)
  var now = Date.now();
  if(then) {
    var delta = now - then;
    update(delta / 1000);
    render();
  }
  then = now;
}

$(document).ready(function() {
  var yo = confirm('sup')
  yo ? (player = hero) && (other = asshole) : (player = asshole) && (other = hero)
  bgImage = new Image()
  bgImage.src = "/images/background.png"
  hero.image.src = "/images/hero.png"
  asshole.image.src = "/images/hero.png"

  canvas = $('#canvas')[0]
  ctx = canvas.getContext("2d")

  $(document).keydown(function(e) {
    keysDown[e.keyCode] = true
  })

  $(document).keyup(function(e) {
    delete keysDown[e.keyCode]
  })
  reset()
  broadcastPosition(player)
  syncPosition(other)
  main(player)
})
