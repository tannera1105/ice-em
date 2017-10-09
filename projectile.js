//leapmotion handclosed
var health = 100
var damage = 10
var enemyfreq = 5200
var score = 0
var alreadySeen = [];
var movingSpeed = 0.0000;




var leap = new THREE.LeapMotion();

AFRAME.registerComponent('spawner', {
  schema: {
    on: {
      default: 'click'
    },
    mixin: {
      default: ''
    }
  },

  init: function() {
    this.leap = leap;
    leap.registerEventHandler(
    THREE.LeapMotion.Events.HAND_STARTED_PUSHING_SCREEN, this.spawn.bind(this));
  },
  /**
   * Add event listener to entity that when emitted, spawns the entity.
   */
  

  update: function(oldData) {
    this.el.addEventListener(this.data.on, this.spawn.bind(this));
  },

  /**
   * Spawn new entity with a mixin of components at the entity's current position.
   */
  spawn: function() {
    if(this.fired) return;
    this.fired = true;
    var el = this.el;

    var entity = document.createElement('a-entity');
    var matrixWorld = el.object3D.matrixWorld;
    var position = new THREE.Vector3();
    var rotation = el.getAttribute('rotation');
    var entityRotation;
        var cameraPos = document.getElementById('player').object3D.position;


    // Have the spawned entity face the same direction as the entity.
    // Allow the entity to further modify the inherited rotation.
    position.setFromMatrixPosition(matrixWorld);
    entity.setAttribute('position', {
      x: cameraPos.x,
      y: cameraPos.y + 3,
      z: cameraPos.z
    });
    entity.setAttribute('mixin', this.data.mixin);
    //entity.setAttribute('obj-model', "obj: #fireball-obj; mtl: #fireball-mtl")
    
    entity.addEventListener('loaded', function() {
      entityRotation = entity.getAttribute('rotation');
      entity.setAttribute('rotation', {
        x: entityRotation.x + rotation.x,
        y: entityRotation.y + rotation.y,
        z: entityRotation.z + rotation.z
      });
    });
    el.sceneEl.appendChild(entity);
    let _this = this;
    setTimeout(() => { _this.fired = false}, 600);
  }
});

AFRAME.registerComponent('click-listener', {
  // When the window is clicked, emit a click event from the entity.
  init: function() {
    var el = this.el;
    window.addEventListener('click', function() {
      el.emit('click', null, false);
    });
  }
});



AFRAME.registerComponent('projectile', {
  schema: {
    speed: { default: 10 }
  },
  tick: function (t) {
    //console.log(t);
    var speed = this.data.speed;
    this.el.object3D.translateY( -speed );
    var entity = this.el;
    var cameraPos = document.getElementById('player').object3D.position;
    if (this.el.object3D.position.z < cameraPos.z - 200 && entity && entity.parentNode) { 
      this.el.removeObject3D(); 
      //console.log("time", t)
      entity.parentNode.removeChild(entity);
    }
  }
});

AFRAME.registerComponent('move-toward-camera', {
  schema: {
    speed: { default: 0.0001 },
    min: {
      default: {
        x: 0,
        y: 4000,
        z: 0
      },
      type: 'vec3'
    },
    max: {
      default: {
        x: 0,
        y: 4300,
        z: 0
      },
      type: 'vec3'
    }
  }, 
  tick: function(t) {
    var data = this.data;
    var max = data.max;
    var min = data.min;

    var speed = movingSpeed || this.data.speed;
    //.object3D.translateZ( speed );
    var entity = this.el;
    var cameraPos = document.getElementById('player').object3D.position,
        position = this.el.object3D.position;
    //console.log("pls", cameraPos.z - position.z)
    if (cameraPos.z - position.z < 10 && !entity.removed) { // TODO: Handle point/ health deduction state here
      entity.removed = true;
      var deathPlane = document.getElementById('death-plane');
      deathPlane.setAttribute('opacity', 0.2);
      deathPlane.setAttribute('position', {
        x: cameraPos.x,
        y: cameraPos.y,
        z: cameraPos.z -5
      })
      health -= damage;
      updateScoreAndHealth();
      if (health <= 0) {
        //console.log('dead', deathPlane)
        health = 100
        damage = 10
        enemyfreq = 5200
        score = 0
      }
      axios.post('http://localhost:3000/z')

      setTimeout(() => {
        deathPlane.setAttribute('opacity', 0);
      }, 200);
    } else if (!entity.removed) {
      var x = Math.random() * (max.x - min.x) + min.x,
     y = Math.random() * (max.y - min.y) + min.y;
    var finalPos = new THREE.Vector3(x, y, -position.z);
      //console.log(finalPos, speed)
    this.el.object3D.translateOnAxis(finalPos, speed);
    } else {
      setTimeout( () => {
        if(this.el) {
          var sphere = this.el;
          if(sphere && sphere.parentNode) {
            sphere.parentNode.removeChild(sphere);
          sphere.removeObject3D();
          }
          
          
        }
        
        
      }, 400)
      
      
    }
    


    
    //this.el.object3D.translateY((position.y - y) / y);


  }
  
})

setInterval(function generateEnemies() {
  var sceneEl = document.querySelector('a-scene'); 
  var player = document.getElementById('player');
      var cameraPos = document.getElementById('player').object3D.position;
      //console.log('make enemies', this);
      //this.frameCount++;

    // Have the spawned entity face the same direction as the entity.
    // Allow the entity to further modify the inherited rotation.
    //position.setFromMatrixPosition(matrixWorld);
    //entity.setAttribute('position', position);
      for(var i=0; i < 1; i++) {
        var max = {
          x: 6,
          y: 30, 
          z: cameraPos.z-160
        },
        min = {
          x: -6,
          y: 20, 
          z: cameraPos.z-120
        },
        newPos = {
          
              x: Math.random() * (max.x - min.x) + min.x,
              y: Math.random() * (max.y - min.y) + min.y,
              z: Math.random() * (max.z - min.z) + min.z
        
        }
        var position = new THREE.Vector3(newPos.x, newPos.y, newPos.z);
/*
        var enemy = document.createElement('a-entity');
            
        enemy.setAttribute('src', "#enemy-alien");
        enemy.setAttribute('class', 'enemy');

        var randomString = "min: -6 -1 " + (20) + "; max: 6 8 " + (60);
          console.log("pls", randomString)
            //enemy.setAttribute('random-position', randomString);

            enemy.setAttribute('transparent', "true");
            enemy.setAttribute('scale', "5 5 3");
            enemy.setAttribute('move-toward-camera', "true")
            enemy.setAttribute('position', position);
            player.appendChild(enemy);
        console.log("pls", enemy.getAttribute('position'))
        */
        var boxEl = document.createElement('a-entity');
        
        //boxEl.setAttribute('material', {color: '#EF2D5E'});
            boxEl.setAttribute('obj-model', 'obj: #blueplane-obj; mtl: #blueplane-mtl')
            boxEl.setAttribute('class', "enemy");
            boxEl.setAttribute('position', position);
            boxEl.setAttribute('scale', "0.1 0.1 0.1");
        boxEl.setAttribute('rotation', "-110 180 0");
            boxEl.setAttribute('move-toward-camera', "true")
        
        

            sceneEl.appendChild(boxEl);
            //console.log(newPos, cameraPos)

      }
  enemyfreq = enemyfreq - 200;
  //movingSpeed += 0.00002;
}, enemyfreq);


AFRAME.registerComponent('collider', {
  schema: {
    target: { default: '' }
  },

  // Calc targets
  init: function () {
   // console.log(this);
    var targetEls = this.el.sceneEl.querySelectorAll(".enemy");
    this.targets = [];
    for (var i=0; i<targetEls.length; i++) {
      this.targets.push(targetEls[i].object3D);
    }
    //console.log(this.targets)
    this.el.object3D.updateMatrixWorld();
  },

  // check collisions w/ cylinder
  tick: function (t) {
    try {
      //console.log("el", this.el)
      var collisionResults;
    var directionVector;
    var el = this.el;
    var sceneEl = el.sceneEl;
    this.el.setAttribute('geometry', 'buffer: false;'); //issue
    var mesh = el.getObject3D('mesh');
    var object3D = el.object3D;
    var raycaster;
    var vertices = mesh.geometry.vertices;
    var bottomVertex = vertices[0].clone();
    var topVertex = vertices[vertices.length -1].clone();
    // calc positions of start and end of obj
    bottomVertex.applyMatrix4(object3D.matrixWorld);
    topVertex.applyMatrix4(object3D.matrixWorld);

    // direction vec from start to end of obj
    directionVector = topVertex.clone().sub(bottomVertex).normalize();

    // raycast for collision
     console.log("bottomVertex", bottomVertex);
    raycaster = new THREE.Raycaster(bottomVertex, directionVector, 1);
    collisionResults = raycaster.intersectObjects(this.targets, true);
    collisionResults.forEach(function (target, i) {
      // tell enemy it was hit
      //console.log()
      target.object.el.emit('collider-hit', {target: el});
      target.object.el.removed = true;
      if (alreadySeen.indexOf(target.object.el) === -1) {
        axios.post('http://localhost:3000/a')
        score += 10;
        updateScoreAndHealth();
        alreadySeen.push(target.object.el);
      }
      
      
      //console.log('Tis but a flesh wound', i);
    });
    } catch(e) {
      
    }
    
  }
});


var planeScore = { 
  lastPos: {
    x: -0.1,
    y: 0.12,
    z: 0.48
  }, 
  onLeft: true,
  xOff: 0.23,
  zOff: 0.2,
  lastScore: 0
};
  
var bombHealth = {
  lastPos: {
    x: -0.08,
    y: 0.2,
    z: 0.65
  }, 
  onLeft: true,
  xOff: 0.23,
  zOff: 0.2,
  lastHealth: 100
}

function displayVictory() {
 var boxEl = document.createElement('a-entity');
  
        //boxEl.setAttribute('material', {color: '#EF2D5E'});
            boxEl.setAttribute('obj-model', 'obj: #blueplane-obj; mtl: #blueplane-mtl')
            boxEl.setAttribute('class', "enemy");
            boxEl.setAttribute('position', position);
            boxEl.setAttribute('scale', "0.1 0.1 0.1");
        boxEl.setAttribute('rotation', "-110 180 0");
            boxEl.setAttribute('move-toward-camera', "true")
}

function displayDefeat() {
 var boxEl = document.createElement('a-entity');
        var camera = document.getElementById('player').object3d;
        camera.position = { x:0, y:0, z:0}
        //boxEl.setAttribute('material', {color: '#EF2D5E'});
            boxEl.setAttribute('text', 'font: mozillavr; value: You couldn\'t ice them fast enough. The game will restart in 5 seconds.')
            boxEl.setAttribute('position', {x:0, y:0, z: -2});
            boxEl.setAttribute('scale', "1 1 1");
            boxEl.setAttribute('id', 'victory-text')
            document.getElementById('a-scene').append(boxEl);

            setTimeout(() => {
                resetAll();
                var vic_tex = document.getElementById('victory-text')
                vic_tex.parentNode.removeChild(vic_tex)
            }, 5000)

}

function updateScoreAndHealth() {
  var scoreText = document.getElementById('score-text');
  var healthText = document.getElementById('health-text');
 

  scoreText.setAttribute('text', "width: 1; color: white; font: mozillavr; value: "+ score);
  if (score != planeScore.lastScore) {
    planeScore.lastScore = score;
    var position = planeScore.lastPos;
    var parent = document.getElementById('score-box');
    var newPlane = document.createElement('a-entity');
    newPlane.setAttribute('obj-model', 'obj: #blueplane-obj; mtl: #blueplane-mtl');
    newPlane.setAttribute('scale', '0.002 0.002 0.002');
    newPlane.setAttribute('rotation', '-90 0 -30');
    newPlane.setAttribute('position', position.x + " " + position.y + " " + position.z);
    parent.append(newPlane);
    if (planeScore.onLeft) {
          planeScore.lastPos.x += planeScore.xOff;
      
    } else {
        planeScore.lastPos.x -= planeScore.xOff;
        planeScore.lastPos.z -= planeScore.zOff;

    }
    planeScore.onLeft = !planeScore.onLeft; 
  }
  
  healthText.setAttribute('text', "width: 1; color: white; font: mozillavr; value: "+ health);
  if (health != bombHealth.lastHealth) {
    bombHealth.lastHealth = health;
    var position = bombHealth.lastPos;
    var parent = document.getElementById('health-box');
    var newHealth = document.createElement('a-entity');
    newHealth.setAttribute('obj-model', 'obj: #bomb-obj; mtl: #bomb-mtl');
    newHealth.setAttribute('scale', '0.009 0.009 0.0075');
    newHealth.setAttribute('rotation', '-90 0 0');
    newHealth.setAttribute('position', position.x + " " + position.y + " " + position.z);
    parent.append(newHealth);
    if (bombHealth.onLeft) {
          bombHealth.lastPos.x += bombHealth.xOff;
      
    } else {
        bombHealth.lastPos.x -= bombHealth.xOff;
        bombHealth.lastPos.z -= bombHealth.zOff;

    }
    bombHealth.onLeft = !bombHealth.onLeft; 
  }
   if(score === 100) {
    resetAll();
    displayVictory();
    return;
  }

  if(health === 0) {
    resetAll();
    displayDefeat();
    return;
  }
}

function resetAll() {
  health = 100
 damage = 10
 enemyfreq = 5200
 score = 0
 alreadySeen = [];
 movingSpeed = 0.0000;
  var camera = document.getElementById('player');
  camera.object3d.position = new Three.Vector3(0,0,0);
  
}

