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

  Platform.prototype.onFrame = function(delta) {

    // Update UI.
    //this.el.css(transform, 'translate(' + this.pos.y + 'px)');
  };


  return Platform;
});