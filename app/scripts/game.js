/*global define, alert */

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

define(['player', 'platform', 'controls', 'background'], function(Player, Platform, Controls, Background) {
  
  var transform = $.fx.cssPrefix + 'transform';

  var NEW_PLATFORM_INTERVAL = 70;

  var inGameMusic = new Audio('../assets/Theme_1.mp3');

  /**
   * Main game class.
   * @param {Element} el DOM element containig the game.
   * @constructor
   */
  var Game = function(el) {
    this.el = el;
    this.platformsEl = el.find('.platforms');
    this.backgroundsEl = el.find('.backgrounds');

    this.player = new Player(this.el.find('.player'), this);
    
    this.RESOLUTION_X = 320; 
    this.RESOLUTION_Y = 480; 

    this.total_y_vel = 0;
    this.cumulutive_y_vel = 0;

    this.backgrounds = [];

    var bg1 = new Background({
      x: 0,
      y: 0,
      width: this.RESOLUTION_X,
      height: this.RESOLUTION_Y
    }, 1)

    this.backgrounds.push(bg1);
    this.backgroundsEl.append(bg1.el);

    var bg2 = new Background({
      x: this.RESOLUTION_X,
      y: -this.RESOLUTION_Y,
      width: this.RESOLUTION_X,
      height: this.RESOLUTION_Y
    }, 2)

    this.backgrounds.push(bg2);
    this.backgroundsEl.append(bg2.el);

    inGameMusic.loop = true;   
   // inGameMusic.play(); 

    // Cache a bound onFrame since we need it each frame.
    this.onFrame = this.onFrame.bind(this);
  };

  /**
   * Reset all game state for a new game.
   */
  Game.prototype.reset = function() {
    // Reset platforms.
    this.platforms = [];
    this.createInitialPlatforms();

    this.player.pos = {x: 140, y: 418};

    Controls.resetKeys();

    // Start game
    this.unfreezeGame();
  };

  /**
   * Runs every frame. Calculates a delta and allows each game entity to update itself.
   */
  Game.prototype.onFrame = function() {
    if (!this.isPlaying) {
      return;
    }

    var now = +new Date() / 1000,
        delta = now - this.lastFrame;
    this.lastFrame = now;

    var playerInfo = this.player.onFrame(delta);
    
    //Is the player moving upwards, then update platforms
    if (playerInfo.oldY > this.player.pos.y) {
      for (var i = 0, p; p = this.platforms[i]; i++) {
          p.onFrame(delta, playerInfo.posY, playerInfo.oldY, playerInfo.velY);

          if (p.rect.y > this.RESOLUTION_Y) {
            this.platforms.remove(i);
          }
      }

      for (var i = 0; i < this.backgrounds.length; i++) {
        this.backgrounds[i].onFrame(delta, playerInfo.posY, playerInfo.oldY, playerInfo.velY);
      }

      this.total_y_vel += Math.abs(playerInfo.velY);
      this.cumulutive_y_vel += Math.abs(playerInfo.velY);

      //If interval reach, create new random platform
      if (this.cumulutive_y_vel > NEW_PLATFORM_INTERVAL) {
          
          var randomX = Math.floor((Math.random()*270)+1);
 
          this.addPlatform(new Platform({
                x: randomX,
                y: -50,
                width: 80,
                height: 80
              }));

          this.cumulutive_y_vel = 0;
      }
    };

    this.checkGameover();

    // Request next frame.
    requestAnimFrame(this.onFrame);
  };

  Game.prototype.checkGameover = function() {
    if (this.player.pos.y > this.RESOLUTION_Y + 50) {
      this.gameover();
    }
  };

  /**
   * Starts the game.
   */
  Game.prototype.start = function() {
    this.reset();
  };

  /**
   * Stop the game and notify user that he has lost.
   */
  Game.prototype.gameover = function() {
    alert('Game over!');
    this.freezeGame();

    var game = this;
    setTimeout(function() {
      game.reset();
    }, 0);
  };

  /**
   * Freezes the game. Stops the onFrame loop and stops any CSS3 animations.
   * Can be used both for game over and pause.
   */
  Game.prototype.freezeGame = function() {
    this.isPlaying = false;
    this.el.addClass('frozen');
  };

  /**
   * Unfreezes the game. Starts the game loop again.
   */
  Game.prototype.unfreezeGame = function() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.el.removeClass('frozen');

      // Restart the onFrame loop
      this.lastFrame = +new Date() / 1000;
      requestAnimFrame(this.onFrame);
    }
  };

  Game.prototype.createInitialPlatforms = function() {
    this.platformsEl.empty();

    // ground
    this.addPlatform(new Platform({
      x: 100,
      y: 418,
      width: 80,
      height: 80
    }));

    this.addPlatform(new Platform({
      x: 150,
      y: 100,
      width: 80,
      height: 80
    }));
    this.addPlatform(new Platform({
      x: 250,
      y: 300,
      width: 80,
      height: 80
    }));
    this.addPlatform(new Platform({
      x: 10,
      y: 150,
      width: 80,
      height: 80
    }));
  };

  Game.prototype.addPlatform = function(platform) {
    this.platforms.push(platform);
    this.platformsEl.append(platform.el);
  };

  /**
   * Cross browser RequestAnimationFrame
   */
  var requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function */ callback) {
          window.setTimeout(callback, 1000 / 60);
        };
  })();

  return Game;
});