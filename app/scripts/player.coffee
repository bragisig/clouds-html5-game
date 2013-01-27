define ['controls'], (controls) ->

  class Player
    speed: 200

    constructor: (el) ->
      @el = el
      @pos =
        x: 0
        y: 0

    onFrame: (delta) ->
      if controls.right
        @pos.x += delta * @speed
      else if controls.left
        @pos.x += delta * @speed * -1
        
      # Update UI
      @el.css '-webkit-transform', "translate(#{@pos.x}px,#{@pos.y}px)"

  return Player;