var ctx, bgImage, then, canvas
var keysDown = {}
var bgReady = false

$(document).ready(function() {

  bgImage = new Image()
  bgImage.src = "/images/background.png"
  hero.image.src = "/images/hero.png"
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
  main()
})

var hero = {
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


function update(modifier) {
  if(37 in keysDown && hero.x > 32) { hero.x -= hero.speed * modifier }
  if(38 in keysDown && hero.y > 32) { hero.y -= hero.speed * modifier }
  if(39 in keysDown && hero.x < canvas.width - 64) { hero.x += hero.speed * modifier }
  if(40 in keysDown && hero.y < canvas.height - 64) { hero.y += hero.speed * modifier }

  if(
    hero.x <= (monster.x + 32) && monster.x <= (hero.x + 32) &&
    hero.y <= (monster.y + 32) && monster.y <= (hero.y + 32)
  ) {
    ++monstersCaught
    reset()
  }
}

function render() {
  ctx.drawImage(bgImage, 0, 0)
  ctx.drawImage(hero.image, hero.x, hero.y)
  ctx.drawImage(monster.image, monster.x, monster.y)

  ctx.fillStyle = "rgb(250, 250, 250)"
  ctx.font = "24px Inconsolata"
  ctx.textAlign = "left"
  ctx.textBaseline = "top"
  ctx.fillText("Monsters caught: " + monstersCaught, 32, 32)
}

function main() {
  var now = Date.now();
  if(then) {
    var delta = now - then;
    update(delta / 1000);
    render();
  }

  then = now;
  requestAnimationFrame(main);
}
