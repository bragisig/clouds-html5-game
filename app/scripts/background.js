/*global $ define */

define(function() {

  var transform = $.fx.cssPrefix + 'transform';

  var BACKGROUND_IMAGES = { 
    1: 'movingBackground1', 
    2: 'movingBackground2'
  };

  var Background = function(rect, bgIndex) {
    this.rect = rect;
    this.rect.right = rect.x + rect.width;

    this.el = $('<div class="'+ BACKGROUND_IMAGES[bgIndex] +'">');
    this.el.css({
      width: rect.width,
      height: rect.height
    });

    this.el.css(transform, 'translateY(' + this.rect.y + 'px)');
  };

  Background.prototype.onFrame = function(delta, playerPosY, playerOldY, playerVelY) {
    //Player is moving upwards
    if (playerOldY > playerPosY) {
      this.rect.y += Math.abs(playerVelY/3)*2;
      
      if (this.rect.y > this.rect.height) {
        this.rect.y = -(this.rect.height - (this.rect.y - this.rect.height));
      }

      this.el.css(transform, 'translateY(' + this.rect.y + 'px)');
    }
  };

  return Background;
});