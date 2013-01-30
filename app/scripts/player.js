/*global $ define */

define(['controls', 'platform'], function(controls, Platform) {

  var PLAYER_SPEED = 300;
  var JUMP_VELOCITY = 700;
  var GRAVITY = 1500;

  var transform = $.fx.cssPrefix + 'transform';

  var Player = function(el, game) {
    this.el = el;
    this.game = game;
    this.pos = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };
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
    if (this.pos.x < 0) {
      this.pos.x = 0;
    }
    else if (this.pos.x > 320) {
      this.pos.x = 320;
    }

    var velY = this.vel.y * delta
    this.pos.y += velY;

    // Check collisions
    this.checkPlatforms(oldY);

    // Update UI.
    this.el.css(transform, 'translate(' + this.pos.x + 'px,' + this.pos.y + 'px)');

    return { 'posY': this.pos.y, 'oldY': oldY, 'velY': velY };
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

  return Player;
});