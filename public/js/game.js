const canvas2 = document.querySelector("#canvas-id-2")
const ctx2 = canvas2.getContext("2d")


const socket = io()
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})


socket.emit('join', {username, room})

socket.on('message', (message) => {
	if(message === 'Username is taken!') {
		location.href = "../index.html"
	}
	else if(message === 'This room is full!') {
		location.href = "../index.html"
	}
	else if(message === 'Your enemy has left!') {
		location.href = "../index.html"
	}
})

socket.on('winMessage', ({message, yourPlayer, enemyPlayer, winner}) => {
	ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
	remove("standing", 0)
	remove("standing", 1)
	ctx2.beginPath()
	ctx2.font = "100px Arial"
	ctx2.textAlign = "center"; 
	ctx2.fillStyle = "white"
	ctx2.fillText(message, 640, 200)
	ctx2.stroke()
	if(winner === 0) {
		if(yourPlayer !== null){
			animationStanding(yourPlayer, 0)
		}
		if(enemyPlayer !== null){
			if(enemyPlayer.direction === "right")
		 		animationAttacked(enemyPlayer, 1, 1)
		 	else 
		 		animationAttacked(enemyPlayer, 1, 0)
		}
	}
	else if(winner === 1) {
		if(yourPlayer !== null){
			console.log(yourPlayer.direction)
			if(yourPlayer.direction === "right")
				animationAttacked(yourPlayer, 0, 1)
			else 
				animationAttacked(yourPlayer, 0, 0)
		}
		if(enemyPlayer !== null){
		 	animationStanding(enemyPlayer, 1)
		}
	}
})

socket.on('data', ({yourPlayer, enemyPlayer}) => {

	ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
	ctx2.beginPath()
	if(yourPlayer.delayStartRound > 0) {
		ctx2.font = "128px Arial"
		ctx2.fillStyle = "white"
		ctx2.fillText(Math.floor(yourPlayer.delayStartRound / 200), 605, 200)
	}
	ctx2.stroke()
	if(yourPlayer !== null){
		drawPlayer(yourPlayer, 0, 0)
	}
	if(enemyPlayer !== null){
	 	drawPlayer(enemyPlayer, 1, 1)
	}
})

const drawPlayer = (data, nr) => {
	ctx2.beginPath()

	//Dev tool
	// ctx2.strokeStyle = "red"
	// ctx2.lineWidth = 5
	// ctx2.rect(data.x, data.y, data.width, data.height)
	//--------

	if(nr == 0){
		ctx2.beginPath()
		for(let i = 1; i <= data.health; ++i){
			ctx2.strokeStyle = "red"
			ctx2.rect(15 + i, 20, 1, 35)
		}
		ctx2.stroke()
		ctx2.beginPath()
		for(let i = data.health + 1; i <= data.maxHealth; ++i) {
			ctx2.strokeStyle = "rgb(255,164,164, 0.999)"
			ctx2.rect(15 + i, 20, 1, 35)
		}
		ctx2.stroke()

		ctx2.beginPath()
		for(let i = 1; i <= data.mana; ++i){
			ctx2.strokeStyle = "blue"
			ctx2.rect(15 + i, 55, 1, 15)
		}
		ctx2.stroke()
		ctx2.beginPath()
		for(let i = data.mana + 1; i <= data.maxMana; ++i) {
			ctx2.strokeStyle = "rgb(168,168,168, 0.999)"
			ctx2.rect(15 + i, 55, 1, 15)
		}
		ctx2.stroke()
	}
	else if(nr == 1) {
		ctx2.beginPath()
		ctx2.lineWidth = 1
		for(let i = 1; i <= Math.abs(data.maxHealth - data.health); ++i) {
			ctx2.strokeStyle = "rgb(255,164,164, 0.999)"
			ctx2.rect(814 + i, 20, 1, 35)
		}
		ctx2.stroke()
		ctx2.beginPath()
		for(let i = Math.abs(data.maxHealth - data.health); i <= data.maxHealth; ++i){
			ctx2.strokeStyle = "red"
			ctx2.rect(814 + i, 20, 1, 35)
		}
		ctx2.stroke()

		ctx2.beginPath()
		for(let i = 0; i <= Math.abs(data.maxMana - data.mana); ++i) {
			ctx2.strokeStyle = "rgb(168,168,168, 0.999)"
			ctx2.rect(814 + i, 55, 1, 15)
		}
		ctx2.stroke()
		ctx2.beginPath()
		for(let i = Math.abs(data.maxMana - data.mana); i <= data.maxMana; ++i){
			ctx2.strokeStyle = "blue"
			ctx2.rect(814 + i, 55, 1, 15)
		}
		ctx2.stroke()

		ctx2.beginPath()
		ctx2.lineWidth = 4
		ctx2.strokeStyle = "black"
		ctx2.rect(813, 19, data.maxHealth + 1, 53)
		ctx2.stroke()
	}
	ctx2.beginPath()
	ctx2.lineWidth = 4
	ctx2.strokeStyle = "black"
	ctx2.rect(15, 19, data.maxHealth + 1, 53)
	ctx2.stroke()

	ctx2.beginPath()
	if(data.direction == "right")
		standingDirection[nr] = 1
	else if(data.direction == "left")
		standingDirection[nr] = 0

	if(data.attacked == true) {
		animationAttacked(data, nr, standingDirection[nr])
	}
	else if(data.inTheAir == true) {
		animationJumping(data, nr, standingDirection[nr])
	}
	else if(data.pressingDown == true) {
		animationDown(data, nr, standingDirection[nr])
	}
	else if(data.inTheFirstAttack == true) {
		animationFirstAttack(data, nr, standingDirection[nr])
	}	
	else if(data.inTheKame == true) {
		animationKame(data, nr, standingDirection[nr])
	}
	else if(data.pressingRight == true) {
		animationRunning(data, nr, "right")
	}
	else if(data.pressingLeft == true) {
		animationRunning(data, nr, "left")
	}
	else {
		animationStanding(data, nr)
	}

	ctx2.stroke()
}

document.onkeydown = function(e) {
	if(e.keyCode === 68 || e.keyCode === 39) { //d
		socket.emit('keyPress', {inputId: "right", state: true})
	}
	else if(e.keyCode === 83 || e.keyCode === 40) { //s
		socket.emit('keyPress', {inputId: "down", state: true})
	}
	else if(e.keyCode === 65 || e.keyCode === 37) { //a
		socket.emit('keyPress', {inputId: "left", state: true})
	}
	else if(e.keyCode === 87 || e.keyCode === 38) { //w
		socket.emit('keyPress', {inputId: "up", state: true})
	}
	else if(e.keyCode === 74) { //j
		socket.emit('keyPress', {inputId: "first_attack", state: true})
	}
	else if(e.keyCode === 75) { //k
		socket.emit('keyPress', {inputId: "kame", state: true})
	}
}

document.onkeyup = function(e) {
	if(e.keyCode === 68 || e.keyCode === 39) { //d
		socket.emit('keyPress', {inputId: "right", state: false})
	}
	else if(e.keyCode === 83 || e.keyCode === 40) { //s
		socket.emit('keyPress', {inputId: "down", state: false})
	}
	else if(e.keyCode === 65 || e.keyCode === 37) { //a
		socket.emit('keyPress', {inputId: "left", state: false})
	}
	else if(e.keyCode === 87 || e.keyCode === 38) { //w
		socket.emit('keyPress', {inputId: "up", state: false})
	}
	else if(e.keyCode === 74) { //j
		socket.emit('keyPress', {inputId: "first_attack", state: false})
	}
	else if(e.keyCode === 75) { //k
		socket.emit('keyPress', {inputId: "kame", state: false})
	}
}


const remove = (action, nr) => {
	if(action !== "standing") {
		standingCount[nr] = 0
	}
	if(action !== "running") {
		runningCount[nr] = 0
	}
	if(action !== "jumping") {
		jumpingCount[nr] = 0
	}
	if(action !== "first_attack") {
		first_attackCount[nr] = 0
	}
	if(action !== "kame") {
		kameCount[nr] = 0
	}
}

const animationRunning = (data, nr, txt) => {

	if(txt == "right"){
		ctx2.drawImage(runningPack[Math.floor(runningCount[nr]) % 4], data.x, data.y, data.width + 50, data.height)
		runningCount[nr] += runningSpeed
		runningCount[nr] %= 4
	}
	else if(txt == "left") {
		ctx2.drawImage(runningPackLeft[Math.floor(runningCount[nr]) % 4], data.x, data.y, data.width + 50, data.height)
		runningCount[nr] += runningSpeed
		runningCount[nr] %= 4
	}
	remove("running", nr)
}

const animationStanding = (data, nr) => {

	if(standingDirection[nr] === 1){
		ctx2.drawImage(standingPack[Math.floor(standingCount[nr]) % 4], data.x, data.y, data.width, data.height)
		standingCount[nr] += standingSpeed
		standingCount[nr] %= 4
	}
	else {
		ctx2.drawImage(standingPackLeft[Math.floor(standingCount[nr]) % 4], data.x, data.y, data.width, data.height)
		standingCount[nr] += standingSpeed
		standingCount[nr] %= 4
	}
	remove("standing", nr)
}

const animationJumping = (data, nr, direction) => {
	if(direction === 1) {		
		ctx2.drawImage(jumpingPack[Math.floor(jumpingCount[nr]) % 2], data.x, data.y, data.width - 35, data.height+30 )
		jumpingCount[nr] += jumpingSpeed
		jumpingCount[nr] %= 2
	}
	else {
		ctx2.drawImage(jumpingPackLeft[Math.floor(jumpingCount[nr]) % 2], data.x, data.y, data.width - 35, data.height+30)
		jumpingCount[nr] += jumpingSpeed
		jumpingCount[nr] %= 2
	}
	remove("jumping", nr)
}

const animationDown = (data, nr, direction) => {
	if(direction == 1) {
		ctx2.drawImage(down, data.x, data.y + 15, data.width, data.height - 15)
	}
	else {
		ctx2.drawImage(downLeft, data.x, data.y + 15, data.width, data.height - 15)
	}
	remove("down", nr)
}

const animationFirstAttack = (data, nr, direction) => {
	if(direction == 1) {
		ctx2.drawImage(first_attackPack[Math.floor(first_attackCount[nr] % 4)], data.x, data.y, data.width + 30, data.height)
		first_attackCount[nr] += first_attackSpeed
		first_attackCount[nr] %= 4
	}
	else {
		ctx2.drawImage(first_attackPackLeft[Math.floor(first_attackCount[nr] % 4)], data.x, data.y, data.width + 30, data.height)
		first_attackCount[nr] += first_attackSpeed
		first_attackCount[nr] %= 4
	}
	remove("first_attack", nr)
}

const animationKame = (data, nr, direction) => {
	if(direction == 1) {
		if(Math.floor(kameCount[nr] % 8) <= 2)
			ctx2.drawImage(kamePack[Math.floor(kameCount[nr] % 8)], data.x, data.y, data.width, data.height)
		else 
			ctx2.drawImage(kamePack[Math.floor(kameCount[nr] % 8)], data.x, data.y, data.width + (150 * Math.floor(kameCount[nr] % 8)), data.height)
		
		kameCount[nr] += kameSpeed
		kameCount[nr] %= 8
	}
	else {
		if(Math.floor(kameCount[nr] % 8) <=  2)
			ctx2.drawImage(kamePackLeft[Math.floor(kameCount[nr] % 8)], data.x, data.y, data.width, data.height)
		else 
			ctx2.drawImage(kamePackLeft[Math.floor(kameCount[nr] % 8)], data.x - (150 * Math.floor(kameCount[nr] % 8)), data.y, data.width + (150 * Math.floor(kameCount[nr] % 8)), data.height)

		kameCount[nr] += kameSpeed
		kameCount[nr] %= 8
	}
	remove("kame", nr)
}

const animationAttacked = (data, nr, direction) => {
	if(direction == 1) {
		ctx2.drawImage(attacked, data.x, data.y, data.width, data.height)
	}	
	else {
		ctx2.drawImage(attackedLeft, data.x, data.y, data.width, data.height)
	}
	remove("attacked", nr)
}