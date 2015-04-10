var ctx, bgImage, then, canvas, player, other
var keysDown = {}
var bgReady = false

var socket = io()

var hero = {
  image: new Image(),
  speed: 256,
  x: 0,
  y: 0
}

var asshole = {
  image: new Image(),
  speed: 256,
  x: 0,
  y: 0
}

function reset() {
  hero.x = canvas.width / 3
  hero.y = canvas.height / 3
  asshole.x = canvas.width / 1.5
  asshole.y = canvas.height / 1.5

}

function update(modifier) {
  (function(player){
    if(37 in keysDown && player.x > 32) { player.x -= player.speed * modifier }
    if(38 in keysDown && player.y > 32) { player.y -= player.speed * modifier }
    if(39 in keysDown && player.x < canvas.width - 64) { player.x += player.speed * modifier }
    if(40 in keysDown && player.y < canvas.height - 64) { player.y += player.speed * modifier }
  })(player)
}

function broadcastPosition(player) {
  setInterval(function() { socket.emit('playerPosition', {"x": player.x, "y": player.y}) }, 15)
}

function syncPosition(otherPlayer) {
  setInterval(function() {
    socket.on('playerPosition', function(player) {
      otherPlayer.x = player.x
      otherPlayer.y = player.y
    })
  }, 15)
}

function render() {
  ctx.drawImage(bgImage, 0, 0)
  ctx.drawImage(hero.image, hero.x, hero.y)
  ctx.drawImage(asshole.image, asshole.x, asshole.y)

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
