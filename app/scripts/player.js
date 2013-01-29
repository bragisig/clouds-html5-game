/*global $ define */

define(['controls', 'platform'], function(controls, Platform) {

  var PLAYER_SPEED = 300;
  var JUMP_VELOCITY = 800;
  var GRAVITY = 1300;
  var EDGE_OF_LIFE = 650; // DUM DUM DUM!

  var transform = $.fx.cssPrefix + 'transform';

  var Player = function(el, game) {
    this.el = el;
    this.game = game;
    this.pos = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };

    this.total_y_vel = 0;
    this.cumulutive_y_vel = 0;
    this.create_platform = 250;
  };

  Player.prototype.onFrame = function(delta) {

    // Player input
    if (controls.keys.right) {
      this.vel.x = PLAYER_SPEED;
    } else if (controls.keys.left) {
      this.vel.x = -PLAYER_SPEED;
    } else {
      this.vel.x = 0;
    }

    // Jump
    if (controls.keys.space && this.vel.y === 0) {
      this.vel.y = -JUMP_VELOCITY;
    }

    // Gravity
    this.vel.y += GRAVITY * delta;

    // Update state
    var oldY = this.pos.y;
    this.pos.x += this.vel.x * delta;
    var velY = this.vel.y * delta
    this.pos.y += velY;

    if (velY*-1 > 0) {
      this.total_y_vel += velY*-1;
      this.cumulutive_y_vel += velY*-1;

      if (this.cumulutive_y_vel > this.create_platform) {
          
          this.game.addPlatform(new Platform({
                x: 200,
                y: 0,
                width: 80,
                height: 50
              }));

          this.cumulutive_y_vel = 0;
      }
    }

    this.movePlatforms(oldY, velY);

    // Check collisions
    this.checkPlatforms(oldY);

    this.checkGameover();

    // Update UI.
    this.el.css(transform, 'translate(' + this.pos.x + 'px,' + this.pos.y + 'px)');
  };

  Player.prototype.movePlatforms = function(oldY, velY) {
      //alert(this.pos.y);
      var platforms = this.game.platforms;
      //If player is moving upwards
      if (oldY > this.pos.y) {

        for (var i = 0, p; p = platforms[i]; i++) {
          if (p.rect.y < 0) {
            p.rect.y = 0;
            //transform-origin: 2px left
            //p.el.css(transform, 'origin: top -50');
          }
          else {
            p.rect.y -= velY;
          }
          
          p.el.css(transform, 'translateY(' + p.rect.y + 'px)');

          if (p.rect.y > 480) {
            platforms.remove(i);
          }
        }
      }
  };


    // Array Remove - By John Resig (MIT Licensed)
  Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };

  Player.prototype.checkPlatforms = function(oldY) {
    var platforms = this.game.platforms;
    for (var i = 0, p; p = platforms[i]; i++) {

      var y_offset = 30
      // Are we crossing Y.
      if (p.rect.y + y_offset >= oldY && p.rect.y + y_offset < this.pos.y) {

        // Is our X within platform width
        if (this.pos.x > p.rect.x && this.pos.x < p.rect.right) {
          // Collision. Let's stop gravity.
          this.pos.y = p.rect.y + y_offset;
          this.vel.y = 0;
        }
      }
    }
  };

  Player.prototype.checkGameover = function() {
    if (this.pos.y > EDGE_OF_LIFE) {
      this.game.gameover();
    }
  };

  return Player;
});