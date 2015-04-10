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


var monster = {
  image: new Image(),
  x: 0,
  y: 0
}

var monstersCaught = 0

function reset() {
  hero.x = canvas.width / 2
  hero.y = canvas.height / 2

  monster.x = 32 + (Math.random() * (canvas.width - 96))
	monster.y = 32 + (Math.random() * (canvas.height - 96))
}

function update(modifier, player) {
  if(37 in keysDown && player.x > 32) { player.x -= player.speed * modifier }
  if(38 in keysDown && player.y > 32) { player.y -= player.speed * modifier }
  if(39 in keysDown && player.x < canvas.width - 64) { player.x += player.speed * modifier }
  if(40 in keysDown && player.y < canvas.height - 64) { player.y += player.speed * modifier }

  if(
    player.x <= (monster.x + 32) && monster.x <= (player.x + 32) &&
    player.y <= (monster.y + 32) && monster.y <= (player.y + 32)
  ) {
    ++monstersCaught
    reset()
  }
}

function broadcastPosition(player) {
  setInterval(function() { socket.emit('playerPosition', {"x": player.x, "y": player.y}) }, 120)
}

function syncPosition(hero) {
  setInterval(function() {
    socket.on('playerPosition', function(player) {
      hero.x = player.x
      hero.y = player.y
    })
  }, 300)
}

function render() {
  ctx.drawImage(bgImage, 0, 0)
  ctx.drawImage(hero.image, hero.x, hero.y)
  ctx.drawImage(asshole.image, asshole.x, asshole.y)
  ctx.drawImage(monster.image, monster.x, monster.y)

  ctx.fillStyle = "rgb(250, 250, 250)"
  ctx.font = "24px Inconsolata"
  ctx.textAlign = "left"
  ctx.textBaseline = "top"
  ctx.fillText("Monsters caught: " + monstersCaught, 32, 32)
}

function main(player) {
  requestAnimationFrame(main)
  var now = Date.now();
  if(then) {
    var delta = now - then;
    update(delta / 1000, player);
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
  monster.image.src = "/images/monster.png"

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
