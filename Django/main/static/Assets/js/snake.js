window.onload = function() {
    document.addEventListener('keydown', changeDirection);
    var loopID =  setInterval(loop, 1000/60); // 60 FPS

    var timerDateSec = new Date();
    timerDateSec.setMinutes(timerDateSec.getMinutes() + 1);
  
    var secondTimerDateSec = timerDateSec.getTime();
  
    var timerCounterSec = setInterval(function () 
    {
        var nowSec = new Date().getTime();
  
        var distanceSec = secondTimerDateSec - nowSec;
  
  
        if (distanceSec < 0)
        {
            clearInterval(loopID);
            clearInterval(timerCounterSec);
        }
  }, 1000)

  }
  
  var timerDate = new Date();
  timerDate.setMinutes(timerDate.getMinutes() + 1);
  
  var secondTimerDate = timerDate.getTime();
  
  var timerCounter = setInterval(function () 
  {
      var now = new Date().getTime();
  
      var distance = secondTimerDate - now;
  
      var minutes = Math.floor((distance % (1000 *60 *60)) /  (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
      document.getElementById("timer").innerHTML = minutes + ":" + seconds;
  
      if (distance < 0)
      {
          clearInterval(timerCounter);
          document.getElementById("timer").innerHTML = "0:0";
      }
  }, 1000)



  var
    canv 				= document.getElementById('mc'), // canvas
    ctx					= canv.getContext('2d'), // 2d context
    gs = fkp			= false, // game started && first key pressed (initialization states)
    speed = baseSpeed 	= 3, // snake movement speed
    xv = yv				= 0, // velocity (x & y)
    px 					= ~~(canv.width) / 2, // player X position
    py 					= ~~(canv.height) / 2, // player Y position
    pw = ph				= 20, // player size
    aw = ah				= 20, // apple size
    apples				= [], // apples list
    trail				= [], // tail elements list (aka trail)
    tail 				= 100, // tail size (1 for 10)
    tailSafeZone		= 20, // self eating protection for head zone (aka safeZone)
    cooldown			= false, // is key in cooldown mode
    score				= 0; // current score
  
  // game main loop
  function loop()
  {
    // logic
    ctx.fillStyle = '#092622';
    ctx.fillRect(0, 0, canv.width, canv.height);
  
    // force speed
    px += xv;
    py += yv;
  
    // teleports
    if( px > canv.width )
      {px = 0;}
  
    if( px + pw < 0 )
      {px = canv.width;}
  
    if( py + ph < 0 )
      {py = canv.height;}
  
    if( py > canv.height )
      {py = 0;}
  
    // paint the snake itself with the tail elements
    ctx.fillStyle = '#cfdd00';
    for( var i = 0; i < trail.length; i++ )
    {
      ctx.fillStyle = trail[i].color || '#cfdd00';
      ctx.fillRect(trail[i].x, trail[i].y, pw, ph);
    }
  
    trail.push({x: px, y: py, color: ctx.fillStyle});
  
    // limiter
    if( trail.length > tail )
    {
      trail.shift();
    }
  
    // eaten
    if( trail.length > tail )
    {
      trail.shift();
    }
  
    // self collisions
    if( trail.length >= tail && gs )
    {
      for( var i = trail.length - tailSafeZone; i >= 0; i-- )
      {
        if(
          px < (trail[i].x + pw)
          && px + pw > trail[i].x
          && py < (trail[i].y + ph)
          && py + ph > trail[i].y
        )
        {
          // got collision
          tail = 10; // cut the tail
          speed = baseSpeed; // cut the speed (flash nomore lol xD)

          document.getElementById("score").innerHTML = "Score: " + tail;
  
          for( var t = 0; t < trail.length; t++ )
          {
            // highlight lossed area
            trail[t].color = 'red';
  
            if( t >= trail.length - tail )
              {break;}
          }
        }
      }
    }
  
    // paint apples
    for( var a = 0; a < apples.length; a++ )
    {
      ctx.fillStyle = apples[a].color;
      ctx.fillRect(apples[a].x, apples[a].y, aw, ah);
    }
  
    // check for snake head collisions with apples
    for( var a = 0; a < apples.length; a++ )
    {
      if(
        px < (apples[a].x + pw)
        && px + pw > apples[a].x
        && py < (apples[a].y + ph)
        && py + ph > apples[a].y
      )
      {
        // got collision with apple
        apples.splice(a, 1); // remove this apple from the apples list
        tail += 10; // add tail length
        document.getElementById("score").innerHTML = "Score: " + tail;
        speed += .1; // add some speed
        spawnApple(); // spawn another apple(-s)
        break;
      }
    }
  }
  
  // apples spawner
  function spawnApple()
  {
    var
      newApple = {
        x: ~~(Math.random() * canv.width),
        y: ~~(Math.random() * canv.height),
        color: 'red'
      };
  
    // forbid to spawn near the edges
    if(
      (newApple.x < aw || newApple.x > canv.width - aw)
      ||
      (newApple.y < ah || newApple.y > canv.height - ah)
    )
    {
      spawnApple();
      return;
    }
  
    // check for collisions with tail element, so no apple will be spawned in it
    for( var i = 0; i < tail.length; i++ )
    {
      if(
        newApple.x < (trail[i].x + pw)
        && newApple.x + aw > trail[i].x
        && newApple.y < (trail[i].y + ph)
        && newApple.y + ah > trail[i].y
      )
      {
        // got collision
        spawnApple();
        return;
      }
    }
  
    apples.push(newApple);
  
    if( apples.length < 3 && ~~(Math.random() * 1000) > 700 )
    {
      // 30% chance to spawn one more apple
      spawnApple();
    }
  }
  
  
  // velocity changer (controls)
  function changeDirection(evt)
  {
    if( !fkp && [37,38,39,40].indexOf(evt.keyCode) > -1 )
    {
      setTimeout(function() {gs = true;}, 1000);
      fkp = true;
      spawnApple();
    }
  
    if( cooldown )
      {return false;}
  
    /*
      4 directional movement.
     */
    if( evt.keyCode == 37 && !(xv > 0) ) // left arrow
      {xv = -speed; yv = 0;}
  
    if( evt.keyCode == 38 && !(yv > 0) ) // top arrow
      {xv = 0; yv = -speed;}
  
    if( evt.keyCode == 39 && !(xv < 0) ) // right arrow
      {xv = speed; yv = 0;}
  
    if( evt.keyCode == 40 && !(yv < 0) ) // down arrow
      {xv = 0; yv = speed;}
  
    cooldown = true;
    setTimeout(function() {cooldown = false;}, 100);
  }





