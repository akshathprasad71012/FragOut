const fov = 60;
const fovIncrements = fov / 120;
const refDistance = 10;
const cursorSensitivityA = 2.5;
const cursorSensitivityT = 3;
const confire = new Audio('./soundtracks/conFire.mp3');
const fire = new Audio("./soundtracks/fire.mp3");
const enemyRayError = 0.5;

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

var playerR = 5;
var playerC = 5;
var playerA = 0;
var playerT = 0;

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
  let delta = 1;
  let deltaR = delta * cosDegrees(playerA);
  let deltaC = delta * sinDegrees(playerA);
  

  if (event.key === "w") { 

    
    playerR -= deltaR;
    playerC += deltaC;
    if(map[Math.round(playerR)][Math.round(playerC)] === "#"){
      playerR += deltaR;
      playerC -= deltaC;
    }
    render();
    
  }
  if (event.key === "s") {
    playerR += deltaR;
    playerC -= deltaC;
    if(map[Math.round(playerR)][Math.round(playerC)] === "#"){
      playerR -= deltaR;
      playerC += deltaC;
    }
    render();
  }
  if (event.key === "a") {
    let dR = Math.round(delta * cosDegrees(playerA - 90));
    let dC = Math.round(delta * sinDegrees(playerA - 90));
    playerR -= dR;
    playerC += dC;
    if(map[Math.round(playerR)][Math.round(playerC)] === "#"){
      playerR += dR;
      playerC -= dC;
    }
    render();
  }
  if (event.key === "d") {
    let dR = Math.round(delta * cosDegrees(playerA + 90));
    let dC = Math.round(delta * sinDegrees(playerA + 90));
    playerR -= dR;
    playerC += dC;
    if(map[Math.round(playerR)][Math.round(playerC)] === "#"){
      playerR += dR;
      playerC -= dC;
    }
    render();
  }
  if (event.key === "ArrowLeft") {
    playerA -= 10;
    render();
  }
  if (event.key === "ArrowRight") {
    playerA += 10;
    render();
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
    playerA += cursorSensitivityA;
    render();
  }

  if(mx < 0){
    playerA -= cursorSensitivityA;
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