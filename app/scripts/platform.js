/*global $ define */

define(function() {

  var transform = $.fx.cssPrefix + 'transform';

  var PLATFORM_TYPES = { 
    1: { className: 'platform1', jumpVelocity: 900 },
    2: { className: 'platform2', jumpVelocity: 900 },
    3: { className: 'platform3', jumpVelocity: 900 },
    4: { className: 'platform4', jumpVelocity: 1400 },
    5: { className: 'platform5', jumpVelocity: 700 },
    6: { className: 'platform6', jumpVelocity: 800 }
  };


  var Platform = function(rect) {
    this.rect = rect;
    this.rect.right = rect.x + rect.width;

    var randomImage = Math.floor((Math.random()*6)+1);

    this.typeIndex = randomImage;

    this.el = $('<div class="'+ PLATFORM_TYPES[this.typeIndex].className +'">');
    this.el.css({
      width: rect.width,
      height: rect.height
    }); 

    this.el.css(transform, 'translate(' + this.rect.x + 'px,' + this.rect.y + 'px)');
  };

  Platform.prototype.onFrame = function(delta, playerInfo) {
    //Player is moving upwards
    if (playerInfo.movingUpwards === true) {
      this.rect.y += Math.abs(playerInfo.velY)*2;
      
      this.el.css(transform, 'translate(' + this.rect.x + 'px,' + this.rect.y + 'px)');
    }
  };

  Platform.prototype.getJumpVelocity = function() {
    return PLATFORM_TYPES[this.typeIndex].jumpVelocity;
  }

  return Platform;
});