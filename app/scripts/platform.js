/*global $ define */

define(function() {

  var transform = $.fx.cssPrefix + 'transform';

  var Platform = function(rect) {
    this.rect = rect;
    this.rect.right = rect.x + rect.width;

  
    this.el = $('<div class="platform">');
    this.el.css({
      width: rect.width,
      height: rect.height
    });

     this.el.css(transform, 'translate(' + this.rect.x + 'px,' + this.rect.y + 'px)');
  };

  Platform.prototype.onFrame = function(delta, playerPosY, playerOldY, playerVelY) {
    if (playerOldY > playerPosY) {
      this.rect.y += Math.abs(playerVelY)*2;
      
      //p.el.css(transform, 'translateY(' + p.rect.y + 'px)');
      this.el.css(transform, 'translate(' + this.rect.x + 'px,' + this.rect.y + 'px)');
    }
  };

  return Platform;
});