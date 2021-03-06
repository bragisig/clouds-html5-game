/*global $ define, Howl */

define(['controls', 'platform'], function(controls, Platform) {

  var transform = $.fx.cssPrefix + 'transform';
  
  var PLAYER_SPEED = 370;
  var JUMP_VELOCITY = 900; 
  var GRAVITY = 2000;
  var PLAYER_MIN_Y = 200;
 
  var startedJumping = false; 

  var jumpingSound = new Howl({
    urls: ['../assets/Jump.wav'],
    autoplay: false,
    loop: false,
  });

  var Player = function(el, game) {
    this.collidedPlatform = null;
    this.el = el;
    this.game = game;
    this.pos = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };

    controls.on('jump', this.onJump.bind(this))
  };

  Player.prototype.onJump = function() {
    startedJumping = true;
  }

  Player.prototype.reset = function() {
    startedJumping = false;
    this.pos = {x: 140, y: 418};
    this.vel.x = 0;
    this.vel.y = 0;

    this.updateUI();
  }

  Player.prototype.onFrame = function(delta) {
    // Player input
    if (startedJumping) { 
      this.vel.x = controls.inputVec.x * PLAYER_SPEED;
    }

     // Jump
    if (startedJumping && this.vel.y === 0) {
      if (!!this.collidedPlatform) {
        JUMP_VELOCITY = this.collidedPlatform.getJumpVelocity();
      }

      this.vel.y = -JUMP_VELOCITY;
      jumpingSound.play();
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
    var movingUpwards = this.pos.y < oldY;
    if (this.pos.y < PLAYER_MIN_Y) {
      this.pos.y = PLAYER_MIN_Y;
    }

    // Check collisions
    this.checkPlatforms(oldY);

    this.updateUI();

    return { 'velY': velY, 'movingUpwards': movingUpwards };
  };

  Player.prototype.updateUI = function() {
    this.el.css(transform, 'translate(' + this.pos.x + 'px,' + this.pos.y + 'px)');
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
          this.collidedPlatform = p;
        }
      }
    }
  };

  return Player;
});