define [], ->
  class Controls
    left: false
    right: false
    up: false
    down: false

    constructor: ->
      $(window)
        .on('keydown', @onKeyDown.bind(@))
        .on('keyup', @onKeyUp.bind(@))
    onKeyDown: (e) ->
      switch e.keyCode
        when 37 then @left = true
        when 38 then @up = true
        when 39 then @right = true
        when 40 then @down = true

    onKeyUp: (e) ->
      switch e.keyCode
        when 37 then @left = false
        when 38 then @up = false
        when 39 then @right = false
        when 40 then @down = false

  return new Controls
