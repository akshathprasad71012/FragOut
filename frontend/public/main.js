const fov = 60;
const fovIncrements = fov / 120;
const refDistance = 10;
const cursorSensitivityA = 0.05;
const cursorSensitivityT = 3;
const confire = new Audio('./soundtracks/conFire.mp3');
const fire = new Audio("./soundtracks/fire.mp3");
const hurt = new Audio("./soundtracks/hurt.mp3");
const enemyRayError = 0.5;
const runTimeout = 50;



var gameId = null;
var playerId = null;

const spawnLocations = [{r:5,c:5}, {r:18,c:23}, {r:18, c:13}, {r:13, c:4}, {r:8, c:24}];
var playerR = 5;
var playerC = 5;
var playerA = 0;
var playerT = 0;
var playerName = sessionStorage.getItem("name") || null;
if(playerName === null){
  playerName = prompt("Enter you name");
  sessionStorage.setItem("name", playerName);
}

var canRun = true;
var ping = 0;
var health = 100;
var kills = 0;
var bestkills = localStorage.getItem("best") || 0;
var sessionKills = sessionStorage.getItem("kill") || 0;
var isTakingMeds = false;
var startTime = null;
var kill1m = sessionStorage.getItem("kill1m") || 0;
var kill3m = sessionStorage.getItem("kill3m") || 0;
var kill5m = sessionStorage.getItem("kill5m") || 0;

var showLeaderboard = false;
var isLeaderboardRendered = false;

let enemyList = [];


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
    playerR = spawnLocations[playerId % spawnLocations.length].r;
    playerC = spawnLocations[playerId % spawnLocations.length].c;
    // console.log(gameId, playerId);
    render();
    emitData(true);
    
  } catch (err) {
    console.log(msg, err);
  }
  return true;
}

function emitData(askIntro){
  if(gameId !== null && playerId !== null){
    //console.log("sending....");
    if(askIntro){
      socket.send(JSON.stringify({"gameId" : gameId, "playerId": playerId, "playerName" : playerName, "playerR": playerR, "playerC": playerC, "askIntro" : true, "sendTime" : Date.now(), "health": health, "killme": false, "kill1m" : kill1m, "kill3m": kill3m, "kill5m": kill5m, "kill": kills, "best": sessionKills}));
    }else{
      socket.send(JSON.stringify({"gameId" : gameId, "playerId": playerId, "playerName" : playerName, "playerR": playerR, "playerC": playerC, "askIntro" : false, "sendTime" : Date.now(), "health": health, "killme": false, "kill1m" : kill1m, "kill3m": kill3m, "kill5m": kill5m, "kill": kills, "best": sessionKills}));
    }
  }
}


function handleNewData(newData){
  let isFound = false;
  // console.log(playerId, newData.playerId, newData.health);
  if(playerId === newData.playerId){
    health = newData.health;
    hurt.play();
    if (health <= 0){
      socket.send(JSON.stringify({"gameId" : gameId, "playerId": playerId, "playerR": playerR, "playerC": playerC, "askIntro" : false, "sendTime" : Date.now(), "health": health, "killme": true, "kill1m" : kill1m, "kill3m": kill3m, "kill5m": kill5m, "kill": kills, "best": sessionKills}));
      socket.close();
      if(confirm("You Died!!!\nPress OK to play again or CANCEL to quit.")){
        location.reload();
      }else{
        window.close();
      }
    }

    render();
    return;
  }
  // console.log(enemyList);
  enemyList.forEach(enemy=>{
    if(enemy.playerId === newData.playerId){
      isFound = true;
      // console.log(newData);
      
      if(newData.killme){
        enemyList.splice(enemyList.indexOf(enemy), 1);
        // console.log(enemyList);
        let e = document.getElementById(enemy.playerId);
        // console.log(enemy.playerId, e);
        
        e && e.remove();
        
      }else{
        enemy.r = newData.playerR;
        enemy.c = newData.playerC;
        enemy.health = newData.health;
      }
      
      
    }
  })
  if(!isFound){
    let newenemy = {"playerName": newData.playerName, "playerId": newData.playerId, "r": newData.playerR, "c": newData.playerC, "show": false, "raycount": 0, "angle": 0, "health": newData.health, "kill1m" : newData.kill1m, "kill3m": newData.kill3m, "kill5m": newData.kill5m, "kill": newData.kill, "best": newData.best};
    //console.log(newenemy);
    enemyList = [...enemyList, newenemy];
    if (startTime === null) startTime = Date.now();

  }
  if(newData.askIntro){
    emitData(false);
  }
  console.log(enemyList);
  
  render();
}


const socket = new WebSocket("ws://192.168.23.215:3000/ws");
socket.addEventListener("message", (event) => {
  let msg = event.data;
  if(!checkWelcome(msg)){
    let obj = JSON.parse(msg);
    let now = Date.now();
    ping = Math.abs(now - obj.sendTime);
    //console.log("receiver", now, "sender", obj.sendTime);
    
    //console.log(enemyList);
    handleNewData(obj);
  }
  
});




//             0    1    2    3    4    5    6    7    8    9    10  11   12   13   14   15   16   17   18   19   20   21   22   23   24   25   26   27   28   29
const map = [["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"  ],//0
             ["#", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],//1
             ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],//2
             ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],//3
             ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],//4
             ["#", " ", " ", " ", " ", " ", " ", " ", " ", "#", "#", "#", "#", "#", "#", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],//5
             ["#", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],//6
             ["#", "#", "#", "#", "#", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", "#"  ],//7
             ["#", " ", " ", " ", "#", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", "#"  ],//8
             ["#", " ", " ", " ", "#", "#", "#", "#", "#", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", "#"  ],//9
             ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", "#"  ],//10
             ["#", "#", "#", "#", "#", "#", "#", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", "#", "#", "#", "#", "#", "#", "#", "#", " ", " ", " ", "#"  ],//11
             ["#", " ", " ", " ", " ", " ", "#", " ", " ", "#", "#", "#", "#", "#", "#", "#", " ", " ", "#", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", "#"  ],//12
             ["#", " ", " ", " ", " ", " ", "#", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", "#", "E", " ", " ", "#"  ],//13
             ["#", " ", " ", " ", " ", " ", "#", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", "#"  ],//14
             ["#", " ", " ", " ", " ", " ", "#", " ", " ", "#", " ", " ", " ", " ", " ", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", " ", " ", " ", "#"  ],//15
             ["#", " ", " ", " ", " ", "E", "#", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", "#"  ],//16
             ["#", " ", " ", " ", "#", "#", "#", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", "#"  ],//17
             ["#", " ", " ", " ", "#", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", "#"  ],//18
             ["#", " ", " ", " ", "#", " ", "#", "#", "#", "#", " ", " ", " ", " ", "E", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", "#"  ],//19
             ["#", " ", " ", " ", "#", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", "#"  ],//20
             ["#", " ", " ", " ", "#", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", "#", "#", "#", "#", "#", "#", "#", " ", " ", " ", " ", " ", " ", " ", "#"  ],//21
             ["#", " ", " ", " ", "#", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],//22
             ["#", " ", " ", " ", "#", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],//23
             ["#", " ", " ", " ", "#", "#", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],//24
             ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],//25
             ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],//26
             ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],//27
             ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"  ],//28
             ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"  ]]//29


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
        //console.log("HIT HIT HIT", playerT, head, feet);
        //let hitHeight = (playerT -feet+50) + (head - 50 - 0.5 - playerT);
        enemy.health -= Math.round((5 + 10**((enemyHeight - playerT)/enemyHeight)) / ((dist +15) / refDistance));
        if(enemy.health <= 0){
          kills++;
          if(kills > bestkills){
            localStorage.setItem("best", kills);
            bestkills = kills;
          }
          if(kills > sessionKills){
            localStorage.setItem("kill", kills);
            sessionKills = kills;
          }
          timeNow = Date.now();
          if(timeNow - startTime <= (1 * 60 * 1000)){
            kill1m++;
            sessionStorage.setItem("kill1m", kill1m);
          }
          if(timeNow - startTime >= (3 * 60 * 1000)){
            kill3m++;
            sessionStorage.setItem("kill3m", kill3m);
          }if(timeNow - startTime >= (5 * 60 * 1000)){
            kill5m++;
            sessionStorage.setItem("kill5m", kill5m);
          }
        }
        // console.log(dist);
        
        render();
        socket.send(JSON.stringify({...enemy, "sendTime" : Date.now()}));
        
        document.getElementById("crosshair-content").innerText = "XXX   +   XXX";
        setTimeout(removeBlood, 1000);

      }else{
        //console.log(playerT, head, feet);
        
      }
    }
  })
}


function renderLeaderboard() {
  let tablerows = `<tr><td>You</td><td>${sessionKills}</td><td>${kill1m}</td><td>${kill3m}</td><td>${kill5m}</td></tr>`;
  enemyList.forEach(enemy=>{
    tablerows += `<tr><td>${enemy.playerName}</td><td>${enemy.best}</td><td>${enemy.kill1m}</td><td>${enemy.kill3m}</td><td>${enemy.kill5m}</td></tr>`;
  })
  document.getElementById("leadertable").innerHTML += tablerows;
}
function derenderLeaderboard() {
  let tablerows = `<tr>
          <th>Player</th>
          <th>Total Kills</th>
          <th>First Minite Kills</th>
          <th>Third Minite Kills</th>
          <th>Fifth Minite Kills</th>
        </tr>`;
  document.getElementById("leadertable").innerHTML = tablerows;
}



//wall = 5 - 100 vh
//sky = groung = (100 - wall) / 2
let wall0 = document.getElementsByClassName("wall")[0];
function render() {

  document.getElementsByClassName("ping")[0].innerText = `PING : ${ping}`;
  document.getElementsByClassName("enemy-count")[0].innerText = `ENEMIES : ${enemyList.length}`;
  if (isTakingMeds){
    document.getElementsByClassName("health")[0].innerText = `HEALTH : ${health}  MEDS++`;
  }else{
    document.getElementsByClassName("health")[0].innerText = `HEALTH : ${health}`;
  }
  document.getElementById("playerId").innerText= `PLAYER : ${playerId}`;
  document.getElementById("kill").innerText= `KILLS : ${kills}`;
  document.getElementById("best").innerText= `HIGHSCORE : ${bestkills}`;
  

  enemyList.forEach(enemy=>{
    // console.log("IODfsidoj", enemy)
    let e = document.getElementById(enemy.playerId);
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
      let enemyHtml = `<div class="enemy-container" id="${enemy.playerId}">
          <div class="topMargin" style="height: ${55 - playerT - enemyHeight/2}vh"></div>
          <div class="content">
            <div class="leftMargin" style="width: ${0.8333 * (60 - (2*(playerA - enemy.angle + angledelta)))}vw"></div>
            <div class="enemy" style="text-align: centre; height: ${enemyHeight}vh; width: ${enemywidth}vw; background: linear-gradient(0, rgba(255,0,0,1) ${Math.max(0, enemy.health - 20)}%, rgba(249,255,0,1) ${enemy.health}%">${enemy.playerName?.slice(0, 3)}</div>
          </div>
        </div>`;
      document.getElementById("allemenycontainers").innerHTML += enemyHtml;

    }
  });
}
render();

document.addEventListener("keyup", (event)=>{
  if(event.key === "c" || event.key === "C"){
    var element = document.getElementById("leaderboard");
    element.classList.add("invisible");
    isLeaderboardRendered = false;
    derenderLeaderboard();
  }
})

document.addEventListener("keydown", (event) => {
  if(event.key === "m" || event.key === "M"){
    isTakingMeds = true;
    render();
    setTimeout(()=>{
      if (isTakingMeds){
        health = Math.min(100, health + 50);
        isTakingMeds = false;
        render();
      }
    },5000);
  }

  let oldR = playerR;
  let oldC = playerC;
  let delta = 1;
  let deltaR = delta * cosDegrees(playerA);
  let deltaC = delta * sinDegrees(playerA);

  if(event.key === "c" || event.key === "C"){
    var element = document.getElementById("leaderboard");
    element.classList.remove("invisible");
    if(!isLeaderboardRendered){
      isLeaderboardRendered = true;
      renderLeaderboard();
    }
    
  }

  if (event.key === "w" || event.key === "W") {
    isTakingMeds = false;
    if (canRun) {
      playerR -= deltaR;
      if (map[Math.round(playerR)][Math.round(playerC)] === "#") {
        playerR += deltaR;
      }

      playerC += deltaC;
      if (map[Math.round(playerR)][Math.round(playerC)] === "#") {
        playerC -= deltaC;
      }
      canRun = false;
      setTimeout(() => {
        canRun = true;
      }, runTimeout);

      render();
    }
  }
  if (event.key === "s" || event.key === "S") {
    isTakingMeds = false;
    if (canRun) {
      playerR += deltaR;
      if (map[Math.round(playerR)][Math.round(playerC)] === "#") {
        playerR -= deltaR;
      }
      playerC -= deltaC;
      if (map[Math.round(playerR)][Math.round(playerC)] === "#") {
        playerC += deltaC;
      }
      canRun = false;
      setTimeout(() => {
        canRun = true;
      }, runTimeout);

      render();
    }
  }
  if (event.key === "a" || event.key === "A") {
    isTakingMeds = false;
    if (canRun) {
      let dR = Math.round(delta * cosDegrees(playerA - 90));
      let dC = Math.round(delta * sinDegrees(playerA - 90));
      playerR -= dR;
      if (map[Math.round(playerR)][Math.round(playerC)] === "#") {
        playerR += dR;
      }
      playerC += dC;
      if (map[Math.round(playerR)][Math.round(playerC)] === "#") {
        playerC -= dC;
      }
      canRun = false;
      setTimeout(() => {
        canRun = true;
      }, runTimeout);

      render();
    }
  }
  if (event.key === "d" || event.key === "D") {
    isTakingMeds = false;
    if (canRun) {
      let dR = Math.round(delta * cosDegrees(playerA + 90));
      let dC = Math.round(delta * sinDegrees(playerA + 90));
      playerR -= dR;
      if (map[Math.round(playerR)][Math.round(playerC)] === "#") {
        playerR += dR;
      }
      playerC += dC;
      if (map[Math.round(playerR)][Math.round(playerC)] === "#") {
        playerC -= dC;
      }
      canRun = false;
      setTimeout(() => {
        canRun = true;
      }, runTimeout);

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
  if(isTakingMeds){
    isTakingMeds = false;
    render();
  }

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