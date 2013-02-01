/*global $ define */

define(function() {

  var transform = $.fx.cssPrefix + 'transform';

  var PLATFORM_CLASSES = { 
    1: 'platform1', 
    2: 'platform2', 
    3: 'platform3', 
    4: 'platform4', 
    5: 'platform5', 
    6: 'platform6' 
  };

  var Platform = function(rect) {
    this.rect = rect;
    this.rect.right = rect.x + rect.width;

  var randomImage = Math.floor((Math.random()*6)+1);

    this.el = $('<div class="'+ PLATFORM_CLASSES[randomImage] +'">');
    this.el.css({
      width: rect.width,
      height: rect.height
    });

    this.el.css(transform, 'translate(' + this.rect.x + 'px,' + this.rect.y + 'px)');
  };

  Platform.prototype.onFrame = function(delta, playerPosY, playerOldY, playerVelY) {
    //Player is moving upwards
    if (playerOldY > playerPosY) {
      this.rect.y += Math.abs(playerVelY)*2;
      
      this.el.css(transform, 'translate(' + this.rect.x + 'px,' + this.rect.y + 'px)');
    }
  };

  return Platform;
});