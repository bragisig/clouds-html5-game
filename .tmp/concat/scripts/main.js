define("controls",[],function(){var e={32:"space",37:"left",38:"up",39:"right",40:"down"},t=20,n=function(){this.reset(),$(window).on("keydown",this.onKeyDown.bind(this)).on("keyup",this.onKeyUp.bind(this)).on("deviceorientation",this.onOrientation.bind(this)).on("touchstart",this.onTouch.bind(this))};return asEvented.call(n.prototype),n.prototype.onKeyDown=function(t){if(t.keyCode in e){var n=e[t.keyCode];this.keys[n]=!0}n==="space"&&this.trigger("jump")},n.prototype.onKeyUp=function(t){if(t.keyCode in e){var n=e[t.keyCode];this.keys[n]=!1}},n.prototype.onTouch=function(e){this.trigger("jump")},n.prototype.onOrientation=function(e){var n=e.gamma;if(window.orientation){var r=window.orientation/90;n=e.beta*r}var i=n/t;this.tilt=Math.max(Math.min(i,1),-1)},n.prototype.onFrame=function(){this.keys.right?this.inputVec.x=1:this.keys.left?this.inputVec.x=-1:this.inputVec.x=0,this.inputVec.x===0&&(this.inputVec.x=this.tilt)},n.prototype.reset=function(){this.inputVec={x:0,y:0},this.tilt=0,this.spacePressed=!1,this.keys={}},new n}),define("platform",[],function(){var e=$.fx.cssPrefix+"transform",t={1:{className:"platform1",jumpVelocity:900},2:{className:"platform2",jumpVelocity:900},3:{className:"platform3",jumpVelocity:900},4:{className:"platform4",jumpVelocity:1400},5:{className:"platform5",jumpVelocity:700},6:{className:"platform6",jumpVelocity:800}},n=function(n){this.rect=n,this.rect.right=n.x+n.width;var r=Math.floor(Math.random()*6+1);this.typeIndex=r,this.el=$('<div class="'+t[this.typeIndex].className+'">'),this.el.css({width:n.width,height:n.height}),this.el.css(e,"translate("+this.rect.x+"px,"+this.rect.y+"px)")};return n.prototype.onFrame=function(t,n){n.movingUpwards===!0&&(this.rect.y+=Math.abs(n.velY)*2,this.el.css(e,"translate("+this.rect.x+"px,"+this.rect.y+"px)"))},n.prototype.getJumpVelocity=function(){return t[this.typeIndex].jumpVelocity},n}),define("player",["controls","platform"],function(e,t){var n=$.fx.cssPrefix+"transform",r=370,i=900,s=2e3,o=200,u=!1,a=new Howl({urls:["../assets/Jump.wav"],autoplay:!1,loop:!1}),f=function(t,n){this.collidedPlatform=null,this.el=t,this.game=n,this.pos={x:0,y:0},this.vel={x:0,y:0},e.on("jump",this.onJump.bind(this))};return f.prototype.onJump=function(){u=!0},f.prototype.reset=function(){u=!1,this.pos={x:140,y:418},this.vel.x=0,this.vel.y=0,this.updateUI()},f.prototype.onFrame=function(t){u&&(this.vel.x=e.inputVec.x*r),u&&this.vel.y===0&&(!this.collidedPlatform||(i=this.collidedPlatform.getJumpVelocity()),this.vel.y=-i,a.play()),this.vel.y+=s*t;var n=this.pos.y;this.pos.x+=this.vel.x*t,this.pos.x<0?this.pos.x=0:this.pos.x>320&&(this.pos.x=320);var f=this.vel.y*t;this.pos.y+=f;var l=this.pos.y<n;return this.pos.y<o&&(this.pos.y=o),this.checkPlatforms(n),this.updateUI(),{velY:f,movingUpwards:l}},f.prototype.updateUI=function(){this.el.css(n,"translate("+this.pos.x+"px,"+this.pos.y+"px)")},f.prototype.checkPlatforms=function(e){var t=this.game.platforms;for(var n=0,r;r=t[n];n++){var i=30;r.rect.y+i>=e&&r.rect.y+i<this.pos.y&&this.pos.x>r.rect.x&&this.pos.x<r.rect.right&&(this.pos.y=r.rect.y+i,this.vel.y=0,this.collidedPlatform=r)}},f}),define("background",[],function(){var e=$.fx.cssPrefix+"transform",t={1:"movingBackground1",2:"movingBackground2"},n=function(n,r){this.rect=n,this.rect.right=n.x+n.width,this.el=$('<div class="'+t[r]+'">'),this.el.css({width:n.width,height:n.height}),this.el.css(e,"translateY("+this.rect.y+"px)")};return n.prototype.onFrame=function(t,n){n.movingUpwards===!0&&(this.rect.y+=Math.abs(n.velY/3)*2,this.rect.y>this.rect.height&&(this.rect.y=-(this.rect.height-(this.rect.y-this.rect.height))),this.el.css(e,"translateY("+this.rect.y+"px)"))},n}),Array.prototype.remove=function(e,t){var n=this.slice((t||e)+1||this.length);return this.length=e<0?this.length+e:e,this.push.apply(this,n)},define("game",["player","platform","controls","background"],function(e,t,n,r){var i=$.fx.cssPrefix+"transform",s=1e3,o=0,u=30,a=0,f=function(t){this.RESOLUTION_X=320,this.RESOLUTION_Y=480,this.el=t,this.platformsEl=t.find(".platforms"),this.backgroundsEl=t.find(".backgrounds"),this.scoreboardEl=t.find(".scoreboard"),this.player=new e(this.el.find(".player"),this),this.setupGameScreens(t),this.setupBackgrounds(),this.freezeGame(),this.onFrame=this.onFrame.bind(this)};f.prototype.setupBackgrounds=function(e){this.backgrounds=[],this.addBackground(new r({x:0,y:0,width:this.RESOLUTION_X,height:this.RESOLUTION_Y},1)),this.addBackground(new r({x:this.RESOLUTION_X,y:-this.RESOLUTION_Y,width:this.RESOLUTION_X,height:this.RESOLUTION_Y},2))},f.prototype.addBackground=function(e){this.backgrounds.push(e),this.backgroundsEl.append(e.el)},f.prototype.onGameOverTransitionEnd=function(e){e.hasClass("center")===!1&&this.unfreezeGame()},f.prototype.setupGameScreens=function(e){self=this,this.gameOverEl=e.find(".gameOver"),this.gameOverEl.on("webkitTransitionEnd",this.onGameOverTransitionEnd.bind(this,this.gameOverEl)),this.gameOverEl.find(".button").click(function(){self.reset(),self.gameOverEl.hasClass("center")===!0&&self.gameOverEl.removeClass("center")}),this.mainScreenEl=e.find(".mainScreen"),this.gameOverEl.on("webkitTransitionEnd",this.onGameOverTransitionEnd.bind(this,this.gameOverEl)),this.mainScreenEl.toggleClass("center"),this.mainScreenEl.find(".button").click(function(){self.username=e.find("input#username").val(),alert(self.username),self.mainScreenEl.toggleClass("center"),self.unfreezeGame()})},f.prototype.addPlatform=function(e){this.platforms.push(e),this.platformsEl.append(e.el)},f.prototype.setupPlatforms=function(){this.platformsEl.empty(),this.addPlatform(new t({x:100,y:418,width:80,height:80})),this.addPlatform(new t({x:150,y:100,width:80,height:80})),this.addPlatform(new t({x:250,y:300,width:80,height:80})),this.addPlatform(new t({x:10,y:150,width:80,height:80}))},f.prototype.reset=function(){a=u,o=s,this.total_y_vel=0,this.cumulutive_y_vel=0,this.scoreboardEl.text(0),this.platforms=[],this.setupPlatforms(),this.player.reset(),n.reset()},f.prototype.onFrame=function(){if(!this.isPlaying)return;var e=+(new Date)/1e3,r=e-this.lastFrame;this.lastFrame=e,n.onFrame();var i=this.player.onFrame(r);if(i.movingUpwards===!0){for(var u=0,f;f=this.platforms[u];u++)f.onFrame(r,i),f.rect.y>this.RESOLUTION_Y&&(this.platforms.remove(u),f.el.remove());for(var u=0;u<this.backgrounds.length;u++)this.backgrounds[u].onFrame(r,i);this.total_y_vel+=Math.abs(i.velY),this.cumulutive_y_vel+=Math.abs(i.velY),this.scoreboardEl.text(Math.round(this.total_y_vel)),this.total_y_vel>o&&(a+=5,o+=s);if(this.cumulutive_y_vel>a){var c=Math.floor(Math.random()*270+1);this.addPlatform(new t({x:c,y:-50,width:80,height:80})),this.cumulutive_y_vel=0}}this.checkGameover(),l(this.onFrame)},f.prototype.checkGameover=function(){this.player.pos.y>this.RESOLUTION_Y+50&&this.gameover()},f.prototype.gameover=function(){this.gameOverEl.find(".headline").text("Game Over"),this.gameOverEl.find(".text").text("Score: "+Math.round(this.total_y_vel)),this.gameOverEl.hasClass("center")===!1&&this.gameOverEl.addClass("center"),this.freezeGame()},f.prototype.start=function(){this.reset()},f.prototype.freezeGame=function(){this.isPlaying=!1},f.prototype.unfreezeGame=function(){this.isPlaying||(this.isPlaying=!0,this.lastFrame=+(new Date)/1e3,l(this.onFrame))};var l=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)}}();return f}),require(["game"],function(e){var t=new e($(".game"));t.start()}),define("main",function(){});