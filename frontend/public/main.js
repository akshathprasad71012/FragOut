const fov = 60;
const fovIncrements = fov / 120;
const refDistance = 10;
const cursorSensitivityA = 0.05;
const cursorSensitivityT = 3;
const confire = new Audio('./soundtracks/conFire.mp3');
const fire = new Audio("./soundtracks/fire.mp3");
const enemyRayError = 0.5;
const runTimeout = 50;

var gameId = null;
var playerId = null;

var playerR = 5;
var playerC = 5;
var playerA = 0;
var playerT = 0;
var canRun = true;

let enemyList = [
  {
    id: 0,
    r: 19,
    c: 14,
    show: false,
    angle: 0,
    raycount: 0,
  },
  {
    id: 1,
    r: 13,
    c: 26,
    show: false,
    angle: 0,
    raycount: 0,
  },
  {
    id: 2,
    r: 16,
    c: 5,
    show: false,
    angle: 0,
    raycount: 0,
  }
];


function checkWelcome(msg){
  let step = 0;
  let prefix = ""
  let game = "";
  let player = "";
  for (let i = 0; i < msg.length; i++) {
    if (msg[i] === "/"){
      step++;
      continue;
    }
    if(step === 0) prefix += msg[i];
    if (step === 1) game += msg[i];
    if (step === 2) player += msg[i];
    
  }
  // console.log(prefix);
  
  if(step === 0 || prefix !== "WELCOME") return false;
  try {
    gameId = parseInt(game);
    playerId = parseInt(player);
    console.log(gameId, playerId);
    emitData(true);
    
  } catch (err) {
    console.log(msg, err);
  }
  return true;
}

function emitData(askIntro){
  if(gameId !== null && playerId !== null){
    console.log("sending....");
    if(askIntro){
      socket.send(JSON.stringify({"gameId" : gameId, "playerId": playerId, "playerR": playerR, "playerC": playerC, "askIntro" : true}));
    }else{
      socket.send(JSON.stringify({"gameId" : gameId, "playerId": playerId, "playerR": playerR, "playerC": playerC, "askIntro" : false}));
    }
    
  }
}

function handleNewData(newData){
  let isFound = false;
  enemyList.forEach(enemy=>{
    if(enemy.id === newData.playerId){
      isFound = true;
      enemy.r = newData.playerR;
      enemy.c = newData.playerC;
    }
  })
  if(!isFound){
    let newenemy = {"id": newData.playerId, "r": newData.playerR, "c": newData.playerC, "show": false, "raycount": 0, "angle": 0};
    console.log(newenemy);
    enemyList = [...enemyList, newenemy];
  }
  if(newData.askIntro){
    emitData(false);
  }
  render();
}


const socket = new WebSocket("ws://localhost:3000/ws");
socket.addEventListener("message", (event) => {
  let msg = event.data;
  if(!checkWelcome(msg)){
    let obj = JSON.parse(msg);
    console.log(obj);
    handleNewData(obj);
  }
  
});






const map = [["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"  ],
             ["#", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],
             ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],
             ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],
             ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", "#", "#", " ", " ", " ", " ", " ", " ", "#"  ],
             ["#", " ", " ", " ", " ", " ", " ", " ", " ", "#", "#", "#", "#", "#", "#", "#", " ", " ", " ", " ", "#", "#", "#", " ", " ", " ", " ", " ", " ", "#"  ],
             ["#", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", "#", "#", " ", " ", " ", " ", " ", " ", " ", "#"  ],
             ["#", "#", "#", "#", "#", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],
             ["#", " ", " ", " ", "#", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],
             ["#", " ", " ", " ", "#", "#", "#", "#", "#", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],
             ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],
             ["#", "#", "#", "#", "#", "#", "#", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", "#", "#", "#", "#", "#", "#", "#", "#", " ", " ", " ", "#"  ],
             ["#", " ", " ", " ", " ", " ", "#", " ", " ", "#", "#", "#", "#", "#", "#", "#", " ", " ", "#", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", "#"  ],
             ["#", " ", " ", " ", " ", " ", "#", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", "#", "E", " ", " ", "#"  ],
             ["#", " ", " ", " ", " ", " ", "#", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", "#"  ],
             ["#", " ", " ", " ", " ", " ", "#", " ", " ", "#", " ", " ", " ", " ", " ", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", " ", " ", " ", "#"  ],
             ["#", " ", " ", " ", " ", "E", "#", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", "#"  ],
             ["#", " ", " ", " ", "#", "#", "#", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", "#"  ],
             ["#", " ", " ", " ", "#", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", "#"  ],
             ["#", " ", " ", " ", "#", " ", "#", "#", "#", "#", " ", " ", " ", " ", "E", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", "#"  ],
             ["#", " ", " ", " ", "#", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", "#"  ],
             ["#", " ", " ", " ", "#", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", "#", "#", "#", "#", "#", "#", "#", " ", " ", " ", " ", " ", " ", " ", "#"  ],
             ["#", " ", " ", " ", "#", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],
             ["#", " ", " ", " ", "#", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],
             ["#", " ", " ", " ", "#", "#", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],
             ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],
             ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],
             ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],
             ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],
             ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"  ]]


function tanDegrees(degrees) {
  const radians = degrees * (Math.PI / 180);
  return Math.tan(radians);
}
function sinDegrees(degrees) {
  const radians = degrees * (Math.PI / 180);
  return Math.sin(radians);
}
function cosDegrees(degrees) {
  const radians = degrees * (Math.PI / 180);
  return Math.cos(radians);
}
function removeBlood(){
  document.getElementById("crosshair-content").innerText = "+";
}

function handleHit(){
  enemyList.forEach(enemy=>{
    if(enemy.show){
      let enemywidth = Math.min(5.6, (enemy.raycount *5.6/120));
      let dist = Math.sqrt(((playerR - enemy.r) ** 2) + ((playerC - enemy.c)**2));
      let enemyHeight = Math.min((refDistance / dist) * 15 + 3, 30);
      let head = 55 - enemyHeight/2;
      let feet = head + enemyHeight;

      if(playerA > (enemy.angle - 1 - (enemywidth/2)) && playerA < (enemy.angle + 0.5) && ((head - 50 - 0.5) <= playerT) && ((feet - 50) >= playerT)){
        //console.log("HIT HIT HIT");
        console.log("HIT HIT HIT", playerT, head, feet);
        
        document.getElementById("crosshair-content").innerText = "XXX   +   XXX";
        setTimeout(removeBlood, 1000);

      }else{
        console.log(playerT, head, feet);
        
      }
    }
  })
}






//wall = 5 - 100 vh
//sky = groung = (100 - wall) / 2
let wall0 = document.getElementsByClassName("wall")[0];
function render() {

  enemyList.forEach(enemy=>{
    let e = document.getElementById(enemy.id);
    e && e.remove();

    enemy.show = false;
    enemy.raycount=0; 
    enemy.angle = 0;

  })

  let wallStrips = document.getElementsByClassName("wall");
  let skyStrips = document.getElementsByClassName("sky");
  let groundStrips = document.getElementsByClassName("ground");
  let wallDistances = [];

  for (
    let angle = playerA - fov / 2;
    angle <= playerA + fov / 2;
    angle += fovIncrements
  ) {
    //for every angle......
    let distance = 0;
    let wallHit = false;
    while (!wallHit) {
      distance += 0.1; //along the ray
      checkC = playerC + Math.floor(distance * sinDegrees(angle));
      checkR = playerR - Math.floor(distance * cosDegrees(angle));
      // checkR =
      //   angle < 90 && angle > -90
      //     ? Math.floor(playerR - distance)
      //     : Math.floor(playerR + distance);
      enemyList.forEach((enemy) => {
        // console.log(playerR , playerC, e);
        
        if (Math.abs(enemy.r - checkR) < enemyRayError && Math.abs(enemy.c - checkC) < enemyRayError) {
          
          enemy.angle = angle;
          enemy.show = true;
          enemy.raycount++;
        }
        
      });

      if (
        checkR < 0 ||
        checkR > map.length - 1 ||
        checkC > map[0].length - 1 ||
        checkC < 0 ||
        map[Math.round(checkR)][Math.round(checkC)] === "#"
      ) {
        wallDistances.push(distance);
        // console.log(angle, checkR, checkC, distance);

        wallHit = true;
      }
    }
  }

  // console.log(enemyList);
  

  for (let i = 0; i < wallStrips.length; i++) {
    let wallH = (refDistance / wallDistances[i]) * 15 + 10;
    let skyH = ((100 - wallH) / 2) - (1  * playerT);
    let groundH = ((100 - wallH) / 2) + (1  * playerT);
    //console.log(skyH);

    let walldelta = 110 * wallDistances[i] * wallDistances[i];
    let greendelta = 0; //5 - 1 * wallDistances[i] * wallDistances[i];

    wallStrips[i].style.height = `${wallH}vh`;
    wallStrips[i].style.backgroundColor = `rgb(${Math.max(
      150 - walldelta / 150,
      56
    )}, ${Math.max(74 - walldelta / 150, 18)}, ${Math.max(
      36 - walldelta / 150,
      9
    )})`; //150, 74, 36 -> 56, 18, 9
    groundStrips[i].style.backgroundColor = `rgb(0, ${45 + greendelta}, ${13 + greendelta
      })`;
    skyStrips[i].style.height = `${Math.max(skyH, 0)}vh`;
    groundStrips[i].style.height = `${Math.max(groundH, 0)}vh`;
  }

  enemyList.forEach((enemy) => {
    
    if (enemy.show) {
      
      let dist = Math.sqrt(((playerR - enemy.r) ** 2) + ((playerC - enemy.c)**2));
      let enemyHeight = Math.min((refDistance / dist) * 15 + 3, 30);
      let enemywidth = Math.min(5.6, (enemy.raycount *5.6/120));
      let angledelta = enemywidth/1.6666; 
      // console.log("Enemy-> ", enemy.r, enemy.c, enemy.angle, enemywidth);
      let enemyHtml = `<div class="enemy-container" id="${enemy.id}">
          <div class="topMargin" style="height: ${55 - playerT - enemyHeight/2}vh"></div>
          <div class="content">
            <div class="leftMargin" style="width: ${0.8333 * (60 - (2*(playerA - enemy.angle + angledelta)))}vw"></div>
            <div class="enemy" style="height: ${enemyHeight}vh; width: ${enemywidth}vw"></div>
          </div>
        </div>`;
      document.getElementById("allemenycontainers").innerHTML += enemyHtml;

    }
  });
}
render();

document.addEventListener("keydown", (event) => {
  let oldR = playerR;
  let oldC = playerC;
  let delta = 1;
  let deltaR = delta * cosDegrees(playerA);
  let deltaC = delta * sinDegrees(playerA);

  if (event.key === "w") {
    if (canRun) {
      playerR -= deltaR;
      playerC += deltaC;
      if (map[Math.round(playerR)][Math.round(playerC)] === "#") {
        playerR += deltaR;
        playerC -= deltaC;
      } else {
        canRun = false;
        setTimeout(() => {
          canRun = true;
        }, runTimeout);
      }
      render();
    }
  }
  if (event.key === "s") {
    if (canRun) {
      playerR += deltaR;
      playerC -= deltaC;
      if (map[Math.round(playerR)][Math.round(playerC)] === "#") {
        playerR -= deltaR;
        playerC += deltaC;
      } else {
        canRun = false;
        setTimeout(() => {
          canRun = true;
        }, runTimeout);
      }
      render();
    }
  }
  if (event.key === "a") {
    if (canRun) {
      let dR = Math.round(delta * cosDegrees(playerA - 90));
      let dC = Math.round(delta * sinDegrees(playerA - 90));
      playerR -= dR;
      playerC += dC;
      if (map[Math.round(playerR)][Math.round(playerC)] === "#") {
        playerR += dR;
        playerC -= dC;
      } else {
        canRun = false;
        setTimeout(() => {
          canRun = true;
        }, runTimeout);
      }
      render();
    }
  }
  if (event.key === "d") {
    if (canRun) {
      let dR = Math.round(delta * cosDegrees(playerA + 90));
      let dC = Math.round(delta * sinDegrees(playerA + 90));
      playerR -= dR;
      playerC += dC;
      if (map[Math.round(playerR)][Math.round(playerC)] === "#") {
        playerR += dR;
        playerC -= dC;
      } else {
        canRun = false;
        setTimeout(() => {
          canRun = true;
        }, runTimeout);
      }
      render();
    }
  }
  if (event.key === "ArrowLeft") {
    playerA -= 10;
    render();
  }
  if (event.key === "ArrowRight") {
    playerA += 10;
    render();
  }

  if(oldC !== playerC || oldR !== playerR){
    emitData(false);
  }
  // console.log("player-> " , playerR, playerC, playerA);
});

document.addEventListener("mousedown", (e)=>{
  confire.play();
  handleHit();

})

document.addEventListener("mouseup", ()=>{
  confire.pause();
  confire.load();
})

document.addEventListener("mousemove", (event)=>{
  //console.log(event.movementX);
  let mx = event.movementX;
  let my = event.movementY;
  //console.log(mx);

  if(mx > 0){
    playerA += Math.max(cursorSensitivityA * mx, 0.5);
    render();
  }

  if(mx < 0){
    playerA += Math.min(cursorSensitivityA * mx, -0.5);
    render();
  }
  if(my > 0){
    if(playerT < 60){
      playerT += cursorSensitivityT;
      render();
    }
  }
  if(my < 0){
    if(playerT > -60){
      playerT -= cursorSensitivityT;
      render();
    }
  }
})

document.addEventListener("click", () => {
  
  handleHit();
  fire.play();
  wall0.requestPointerLock();

});