const canvas = document.querySelector("#canvas-id")
const ctx = canvas.getContext("2d")


///Images
//-----Background
let backPack = []
let back1 = document.querySelector("#background1"); backPack.push(back1);
let back2 = document.querySelector("#background2"); backPack.push(back2);
let back3 = document.querySelector("#background3"); backPack.push(back3);
let back4 = document.querySelector("#background4"); backPack.push(back4);
let back5 = document.querySelector("#background5"); backPack.push(back5);
let back6 = document.querySelector("#background6"); backPack.push(back6);
let back7 = document.querySelector("#background7"); backPack.push(back7);
let back0 = document.querySelector("#background0"); backPack.push(back0);

//-----Player
//-----//-----Standing
let standingCount = [0, 0]
let standingSpeed = 0.10
let standingPack = []
let standingDirection = [1, 1]
let standing0 = document.querySelector("#standing0"); standingPack.push(standing0);
let standing1 = document.querySelector("#standing1"); standingPack.push(standing1);
let standing2 = document.querySelector("#standing2"); standingPack.push(standing2);
let standing3 = document.querySelector("#standing3"); standingPack.push(standing3);
let standingPackLeft = []
let standing0Left = document.querySelector("#standing0Left"); standingPackLeft.push(standing0Left);
let standing1Left = document.querySelector("#standing1Left"); standingPackLeft.push(standing1Left);
let standing2Left = document.querySelector("#standing2Left"); standingPackLeft.push(standing2Left);
let standing3Left = document.querySelector("#standing3Left"); standingPackLeft.push(standing3Left);

//-----//-----Running
let runningCount = [0, 0]
let runningSpeed = 0.10
let runningPack = []
let runningPackLeft = []
let running0Left = document.querySelector("#running0Left"); runningPackLeft.push(running0Left);
let running1Left = document.querySelector("#running1Left"); runningPackLeft.push(running1Left);
let running2Left = document.querySelector("#running2Left"); runningPackLeft.push(running2Left);
let running3Left = document.querySelector("#running3Left"); runningPackLeft.push(running3Left);
let running0 = document.querySelector("#running0"); runningPack.push(running0);
let running1 = document.querySelector("#running1"); runningPack.push(running1);
let running2 = document.querySelector("#running2"); runningPack.push(running2);
let running3 = document.querySelector("#running3"); runningPack.push(running3);

//-----//-----Jumping
let jumpingCount = [0, 0]
let jumpingSpeed = 0.08
let jumpingPack = []
let jumpingPackLeft = []
let jumping0Left = document.querySelector("#jumping0Left"); jumpingPackLeft.push(jumping0Left);
let jumping1Left = document.querySelector("#jumping1Left"); jumpingPackLeft.push(jumping1Left);
let jumping0 = document.querySelector("#jumping0"); jumpingPack.push(jumping0);
let jumping1 = document.querySelector("#jumping1"); jumpingPack.push(jumping1);

//-----//-----Down
let down = document.querySelector("#down0")
let downLeft = document.querySelector("#down0Left")

//-----//-----First Attack
let first_attackCount = [0, 0]
let first_attackSpeed = 0.5
let first_attackPack = []
let first_attackPackLeft = []
let first_attack0Left = document.querySelector("#first_attack0Left"); first_attackPackLeft.push(first_attack0Left);
let first_attack1Left = document.querySelector("#first_attack1Left"); first_attackPackLeft.push(first_attack1Left);
let first_attack2Left = document.querySelector("#first_attack2Left"); first_attackPackLeft.push(first_attack2Left);
let first_attack3Left = document.querySelector("#first_attack3Left"); first_attackPackLeft.push(first_attack3Left);
let first_attack0 = document.querySelector("#first_attack0"); first_attackPack.push(first_attack0);
let first_attack1 = document.querySelector("#first_attack1"); first_attackPack.push(first_attack1);
let first_attack2 = document.querySelector("#first_attack2"); first_attackPack.push(first_attack2);
let first_attack3 = document.querySelector("#first_attack3"); first_attackPack.push(first_attack3);

//-----//-----Kamehameha
let kameCount = [0, 0]
let kameSpeed = 0.15
let kamePack = []
let kamePackLeft = []
let kame0Left = document.querySelector("#kame0Left"); kamePackLeft.push(kame0Left);
let kame1Left = document.querySelector("#kame1Left"); kamePackLeft.push(kame1Left);
let kame2Left = document.querySelector("#kame2Left"); kamePackLeft.push(kame2Left);
let kame3Left = document.querySelector("#kame3Left"); kamePackLeft.push(kame3Left);
let kame4Left = document.querySelector("#kame4Left"); kamePackLeft.push(kame4Left);
let kame5Left = document.querySelector("#kame5Left"); kamePackLeft.push(kame5Left);
let kame6Left = document.querySelector("#kame6Left"); kamePackLeft.push(kame6Left);
let kame7Left = document.querySelector("#kame7Left"); kamePackLeft.push(kame7Left);
let kame0 = document.querySelector("#kame0"); kamePack.push(kame0);
let kame1 = document.querySelector("#kame1"); kamePack.push(kame1);
let kame2 = document.querySelector("#kame2"); kamePack.push(kame2);
let kame3 = document.querySelector("#kame3"); kamePack.push(kame3);
let kame4 = document.querySelector("#kame4"); kamePack.push(kame4);
let kame5 = document.querySelector("#kame5"); kamePack.push(kame5);
let kame6 = document.querySelector("#kame6"); kamePack.push(kame6);
let kame7 = document.querySelector("#kame7"); kamePack.push(kame7);
//-----//-----Attacked
let attacked = document.querySelector("#attacked")
let attackedLeft = document.querySelector("#attackedLeft")
//-----------------------------------------------------------
///Variables
let countBack = 0
let speedBack = 0.16


function draw() {

	ctx.beginPath();
	ctx.drawImage(backPack[Math.floor(countBack) % 7], 0, 0, 1280, 720);
	//Dev tool
	ctx.strokeStyle = "red"
	ctx.lineWidth = 5
	//ctx.rect(0, 640, 1280, 720)
	//--------
	ctx.stroke();


	countBack += speedBack

	window.requestAnimationFrame(draw);
}

draw()