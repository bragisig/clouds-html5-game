/*global define, alert */

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

define(['player', 'platform', 'controls', 'background'], function(Player, Platform, Controls, Background) {
  
  var transform = $.fx.cssPrefix + 'transform';

  var INCREASE_DIFF_INTERVAL = 1000;
  var increaseDiff = 0;
  var INITIAL_NEW_PLATFORM_INTERVAL = 30;
  var newPlatformInterval = 0;

  var inGameMusic = new Audio('../assets/Theme_1.mp3');

  /**
   * Main game class.
   * @param {Element} el DOM element containing the game.
   * @constructor
   */
  var Game = function(el) {
    this.RESOLUTION_X = 320; 
    this.RESOLUTION_Y = 480; 

    this.el = el;
    this.platformsEl = el.find('.platforms');
    this.backgroundsEl = el.find('.backgrounds');
    this.scoreboardEl = el.find('.scoreboard');
    this.player = new Player(this.el.find('.player'), this);

    this.setupGameScreens(el);

    this.setupBackgrounds();

    inGameMusic.loop = true;   
    // inGameMusic.play(); 

    this.freezeGame();

    // Cache a bound onFrame since we need it each frame.
    this.onFrame = this.onFrame.bind(this);
  };

  Game.prototype.setupBackgrounds = function(backgr) {
    this.backgrounds = [];

    this.addBackground(new Background({
      x: 0,
      y: 0,
      width: this.RESOLUTION_X,
      height: this.RESOLUTION_Y
    }, 1));

    this.addBackground(new Background({
      x: this.RESOLUTION_X,
      y: -this.RESOLUTION_Y,
      width: this.RESOLUTION_X,
      height: this.RESOLUTION_Y
    }, 2));
  }

  Game.prototype.addBackground = function(backgr) {
    this.backgrounds.push(backgr);
    this.backgroundsEl.append(backgr.el);
  }

  Game.prototype.onGameOverTransitionEnd = function(el) {
      if (el.hasClass('center') === false) {
        this.unfreezeGame();
      }; 
  };

  Game.prototype.setupGameScreens = function(gameEl) {
    self = this;
    
    this.gameOverEl = gameEl.find('.gameOver');
    this.gameOverEl.on('webkitTransitionEnd', this.onGameOverTransitionEnd.bind(this, this.gameOverEl));
    this.gameOverEl.find('.button').click(function() {
      self.reset();
    
      if (self.gameOverEl.hasClass('center') === true) {
        self.gameOverEl.removeClass('center');
      }; 
    });

    this.mainScreenEl = gameEl.find('.mainScreen');
    this.mainScreenEl.on('webkitTransitionEnd', this.onGameOverTransitionEnd.bind(this, this.mainScreenEl));
    this.mainScreenEl.toggleClass('center');
    this.mainScreenEl.find('.button').click(function() {
      self.mainScreenEl.toggleClass('center');
      self.unfreezeGame();
    });
  }

  Game.prototype.addPlatform = function(platform) {
    this.platforms.push(platform);
    this.platformsEl.append(platform.el);
  };

  Game.prototype.setupPlatforms = function() {
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

  /**
   * Reset all game state for a new game.
   */
  Game.prototype.reset = function() {
    newPlatformInterval = INITIAL_NEW_PLATFORM_INTERVAL;
    increaseDiff = INCREASE_DIFF_INTERVAL;

    this.total_y_vel = 0;
    this.cumulutive_y_vel = 0;

    this.scoreboardEl.text(0);

    // Reset platforms.
    this.platforms = [];
    this.setupPlatforms();

    this.player.reset();

    Controls.reset();
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

    Controls.onFrame();
    var playerInfo = this.player.onFrame(delta);
    
    //Is the player moving upwards, then update platforms
    if (playerInfo.movingUpwards === true) {
      for (var i = 0, p; p = this.platforms[i]; i++) {
          p.onFrame(delta, playerInfo);

          if (p.rect.y > this.RESOLUTION_Y) {
            this.platforms.remove(i);
            p.el.remove();
          }
      }

      for (var i = 0; i < this.backgrounds.length; i++) {
        this.backgrounds[i].onFrame(delta, playerInfo);
      }

      this.total_y_vel += Math.abs(playerInfo.velY);
      this.cumulutive_y_vel += Math.abs(playerInfo.velY);

      this.scoreboardEl.text(Math.round(this.total_y_vel));

      if (this.total_y_vel > increaseDiff) {
        newPlatformInterval += 5;
        increaseDiff += INCREASE_DIFF_INTERVAL;
      }


      //If interval reach, create new random platform
      if (this.cumulutive_y_vel > newPlatformInterval) {
          
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
   * Stop the game and notify user that he has lost.
   */
  Game.prototype.gameover = function() {
    this.gameOverEl.find('.headline').text('Game Over');
    this.gameOverEl.find('.text').text('Score: '+ Math.round(this.total_y_vel));
    //this.gameOverEl.css('visibility', 'visible');

    if (this.gameOverEl.hasClass('center') === false) {
      this.gameOverEl.addClass('center');
    }

    this.freezeGame();

    //var game = this;
    //setTimeout(function() {
    //  game.reset();
    //}, 0);
  };

  /**
   * Starts the game.
   */
  Game.prototype.start = function() {
    this.reset();
  };

  /**
   * Freezes the game. Stops the onFrame loop and stops any CSS3 animations.
   * Can be used both for game over and pause.
   */
  Game.prototype.freezeGame = function() {
    this.isPlaying = false;

  };

  /**
   * Unfreezes the game. Starts the game loop again.
   */
  Game.prototype.unfreezeGame = function() {
    if (!this.isPlaying) {
      this.isPlaying = true;

      // Restart the onFrame loop
      this.lastFrame = +new Date() / 1000;
      requestAnimFrame(this.onFrame);
    }
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