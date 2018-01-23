// sounds of the games
var loseLive = new Audio('sounds/Ball_Bounce.mp3');
var scorePlus = new Audio('sounds/jump.mp3');
var backSound = new Audio('sounds/More-Monkey-Island-Band.mp3');
var winSound = new Audio('sounds/win.wav');
var loseSound = new Audio('sounds/lose.wav');
backSound.pause();
// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/bug.png'; //enemy-bug.png';
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.canMove = false;
    this.canUpdate = false;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if (this.canUpdate && this.canMove && this.x < 505) {
        this.x += (200 * dt);
    } else {
        this.reset();
    }
    //check enemies collide with player
    if (this.x < player.x + 20 && this.x + 50 > player.x && this.y < player.y + 40 && this.y + 30 > player.y && this.canMove) {
        if (hearts.length > 1) {
            loseLive.play();
            removeHeart();
            player.reset();
        } else if (hearts.length === 1) {
            removeHeart();
            player.canUpdate = false;
            enemiesCanUpdate(false);
            gameOver();
        }
    }
};




// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    if (this.canMove) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

Enemy.prototype.reset = function() {
    this.x = this.originalX;
    this.y = this.originalY;
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {

    this.sprite = "images/girl.png";
    this.x = 202;
    this.y = 400;
    this.score = 0;
    this.lives = 3;
    this.canMove = false;
    this.canUpdate = false;
    this.effecEnterval;
};

Player.prototype.render = function() {
    if (this.canMove) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

Player.prototype.update = function() {
    backSound.play();
  
    if (this.canMove && this.canUpdate) {
        if (this.y < -20) {

            if (this.score < 4) {
                scorePlus.play();
                this.score++;
            } else if (this.score === 4) {
                scorePlus.play();

                enemiesCanMove(false);
                player.score++;
            }
            this.reset();
        }
        if (player.score === 5) {
            drawDiamond();
            if (player.x === 404 && player.y === 317) {
                removeDiamond();
                this.reset();
                gameWin();
            }
        }
    }
};

Player.prototype.reset = function() {
    this.x = 202;
    this.y = 400;
};

//when the player collide with enemies, the player will flash at the moment
Player.prototype.effect = function() {
    this.effecEnterval = setInterval(function() {
        if (this.x === -500) {
            this.x = 202;
            player.canUpdate = false;
        } else {
            this.x = -500;
        }
    }.bind(this), 150);
};

//heart lives class
var Heart = function(x, y) {
    this.sprite = new Image();
    this.sprite.src = "images/Heart.png";
    this.x = x;
    this.y = y;
};

Heart.prototype.render = function() {
    ctx.drawImage(this.sprite, this.x, this.y, 29, 50);
};
//to remove the live 
Heart.prototype.remove = function() {
    ctx.clearRect(this.sprite, this.x, this.y, 29, 50);
};

//Diamond class 
var Diomond = function(x, y) {
    this.sprite = new Image();
    this.sprite.src = "images/diamond.png";
    this.x = x;
    this.y = y;
};

Diomond.prototype.render = function() {
    ctx.drawImage(this.sprite, this.x, this.y, 70, 90);
};

Diomond.prototype.remove = function() {
    ctx.clearRect(this.sprite, this.x, this.y, 70, 90);
    player.canUpdate = false;
};
//Assistant function

//to draw lives on the screen
var drawHearts = function() {
    hearts = [heart1, heart2, heart3];
    hearts.forEach(function(heart) {
        heart.render();
    });
};
//to draw lives on the screen
var removeHeart = function() {
    hearts[hearts.length - 1].remove();
    hearts.pop();
    enemiesCanUpdate(false);
    player.effect();
    setTimeout(function() {
        clearInterval(player.effecEnterval);
        if (hearts.length !== 0) {
            enemiesCanUpdate(true);
            player.canUpdate = true;
        }
    }.bind(player), 1000);
};
//to draw the win diamond on the screen
var drawDiamond = function() {
    if (player.score === 5) {
        diamonds = [diamond1];
        diamonds.forEach(function(diamond) {
            diamond.render();
        });
    }
};
//to remove win diamond from the screen
var removeDiamond = function() {
    diamonds[diamonds.length - 1].remove();
    diamonds.pop();
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var enemy1 = new Enemy(0, 55);
var enemy2 = new Enemy(-135, 55);
var enemy3 = new Enemy(-90, 140);
var enemy4 = new Enemy(-450, 140);
var enemy5 = new Enemy(0, 230);
var enemy6 = new Enemy(-300, 230);
var allEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6];

var player = new Player();

var heart1 = new Heart(410, 45);
var heart2 = new Heart(440, 45);
var heart3 = new Heart(470, 45);
var hearts = [heart1, heart2, heart3];

var diamond1 = new Diomond(425, 380);
var diamonds = [diamond1];


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
Player.prototype.handleInput = function(direction) {
    if (direction === 'left' && this.x > 50) {
        this.x -= 101;
    }
    if (direction === 'right' && this.x < 400) {
        this.x += 101;
    }
    if (direction === 'up' && this.y > -20) {
        this.y -= 83;
    }
    if (direction === 'down' && this.y < 400) {
        this.y += 83;
    }
};

var character = "girl";
//to start the game when start button click
document.getElementById('start-btn').onclick = function() {
    functionStart();
};
//check player character
var functionStart = function() {
    if (character === "girl") {
        functionGirl();
    } else if (character === "boy") {
        functionBoy();
    }
};
//////////******* Girl character ***********
document.getElementById('girl-btn').onclick = function() {
    functionG();
};
var functionG = function() {
    character = "girl";
};
var functionGirl = function() {
    character = "girl";
    player.sprite = "images/girl.png";
    hearts.forEach(function(heart) {
        heart.sprite.src = "images/live1.png";
    });
    // document.getElementById("dialog").style.display= 'none';
    // document.getElementById("dialog").style.display= 'none';
    document.getElementById("game-title").style.display = 'block';
    document.getElementById("game-div").style.display = 'none';
    player.canMove = true;
    enemiesCanMove(true);
    player.canUpdate = true;
    enemiesCanUpdate(true);
};
//******* Boy character ***********
document.getElementById('boy-btn').onclick = function() {
    functionB();
};
var functionB = function() {
    character = "boy";
};
var functionBoy = function() {
    character = "boy";
    player.sprite = "images/boy.png";
    hearts.forEach(function(heart) {
        heart.sprite.src = "images/live2.png";
    });
    document.getElementById("game-title").style.display = 'block';
    document.getElementById("game-div").style.display = 'none';
    player.canMove = true;
    enemiesCanMove(true);
    player.canUpdate = true;
    enemiesCanUpdate(true);

};
//button (try again) when game over 
document.getElementById('try-btn').onclick = function() {
    functionTry();
};
var functionTry = function() {
    loseSound.pause();
    loseSound.currentTime = 0;
    drawHearts();
    player.score = 0;
    document.getElementById('game-over').style.display = 'none';
    document.getElementById("game-title").style.display = 'none';
    document.getElementById("game-div").style.display = 'block';
};

//button (play again) when player win
document.getElementById('win-btn').onclick = function() {
    functionWin();
};
var functionWin = function() {
    winSound.pause();
    winSound.currentTime = 0;
    drawHearts();
    player.score = 0;
    document.getElementById('game-win').style.display = 'none';
    document.getElementById("game-title").style.display = 'none';
    document.getElementById("game-div").style.display = 'block';
};
//game over function
var gameOver = function() {
    loseSound.play();
    backSound.pause();
    backSound.currentTime = 0;
    document.getElementById("game-over").style.display = 'block';
};
//win function
var gameWin = function() {
    winSound.play();
    backSound.pause();
    backSound.currentTime = 0;
    document.getElementById("game-win").style.display = 'block';
};
//function to make the enemies cann't move
var enemiesCanUpdate = function(status) {
    allEnemies.forEach(function(enemy) {
        enemy.canUpdate = status;
    });
};
//function to make the enemies cann't move
var enemiesCanMove = function(status) {
    allEnemies.forEach(function(enemy) {
        enemy.canMove = status;
    });
};

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
