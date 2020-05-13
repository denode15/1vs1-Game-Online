const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const {addUser, removeUser, getEnemyId, getUser,
	   getAllTheRooms, getUsersInThisRoom} = require('./utils/users.js')


const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let listPlayers = []
let listSockets = []

//const firstAttackDist = 10

class Player{
	constructor(_id) {
		this.x = 0;
		this.y = 0;
		this.id = _id
		this.width = 160
		this.height = 160
		this.pressingLeft = false
		this.pressingRight = false
		this.pressingUp = false
		this.pressingDown = false
		this.velocity = 0
		this.gravity = 1.2
		this.speed = 7
		this.inTheAir = false
		this.jump = false
		this.startGame = true
		this.roundStart = false
		this.delayStartRound = null
		this.direction = "right"
		//FIRST ATTACK
		this.pressingFirstAttack = false
		this.inTheFirstAttack = false
		this.inTheFirstAttackStart = 0
		this.inTheFirstAttackFinal = 25
		this.firstAttackDamage = 0.2
		this.firstAttackTime = 10
		//-----------
		//KAMEHAMEHA
		this.pressingKame = false
		this.inTheKame = false
		this.inTheKameStart = 0
		this.inTheKameFinal = 56
		this.kameDamage = 1.6
		//-----------
		this.attacking = false
		this.typeOfAttack = null
		this.health = 450
		this.mana = 0
		this.maxMana = 450
		this.maxHealth = 450
		this.attacked = false
		this.attackedTimeStart = 0
		this.attackedTimeFinal = 0
		this.playerIsDead = false
		this.playerIsDeadDelay = 200
	}

	update() {	
		if(this.attacked == false){
			///Left Right Jump
			if(this.pressingDown == false && this.inTheFirstAttack == false && this.inTheKame == false){
				if(this.pressingLeft == true) {
					this.direction = "left"
					if(this.x - this.speed + 20 > 0)
						this.x -= this.speed
				}
				if(this.pressingRight == true) {
					if(this.x + this.width <= 1280)
						this.x += this.speed
					this.direction = "right"
				}
			}

			//First Attack
			if(this.inTheFirstAttack == true) {
				if(this.inTheFirstAttackStart > this.inTheFirstAttackFinal){
					this.inTheFirstAttack = false
					this.attacking = false
					this.inTheFirstAttackStart = 0
					this.typeOfAttack = null
				}
				this.inTheFirstAttackStart ++
			}
			else if(this.pressingFirstAttack == true && this.pressingDown == false && this.inTheAir == false && this.inTheKame == false) {
				this.inTheFirstAttack = true
				this.typeOfAttack = "first_attack"
				this.attacking = true
			}

			//Kamehameha
			if(this.inTheKame == true) {
				if(this.inTheKameStart > this.inTheKameFinal){
					this.inTheKame = false
					this.attacking = false
					this.inTheKameStart = 0
					this.typeOfAttack = null
					this.pressingKame = false
				}
				this.inTheKameStart ++
			}
			else if(this.pressingKame == true && this.pressingDown == false && this.inTheAir == false) {
				this.inTheKame = true
				this.typeOfAttack = "kamehameha"
				this.attacking = true
			}

			if(this.pressingUp == true && this.inTheAir == false && this.inTheFirstAttack == false) {
				this.jump = true
				this.velocity = 27
			}

			///Gravity
			if(this.jump == true){
				this.inTheAir = true
				if(this.velocity > 0){
					this.y -= this.velocity
					if(this.y + this.velocity <= 640 - this.height)
						this.velocity -= this.gravity
					else {
						this.velocity = 0
						this.y = 640 - this.height
					}
					this.velocity *= 0.98;
				}
				else {
					this.jump = false
				}
			}
			else {
				this.y += this.velocity
				if(this.y + this.velocity <= 640 - this.height)
					this.velocity += this.gravity
				else {
					this.inTheAir = false
					this.startGame = false
					this.velocity = 0
					this.y = 640 - this.height
				}
				this.velocity *= 0.95
			}

			//Change the width in the air.
		}
		else {
			if(this.attackedTimeStart >= this.firstAttackTime)
				this.attacked = false
			if(this.attackedTimeStart >= this.attackedTimeFinal) {
				this.attacked = false
				this.attackedTimeStart = 0
				this.attackedTimeFinal = 0
			}
			else {
				this.attackedTimeStart ++
			}
		}
	}
}


io.on('connection', (socket) => {

	//When someone enter in the game
	socket.on('join', ({username, room}) => {
		const _id = socket.id
		const {error, user, users, rooms, roomControl} = addUser({username, room, _id})
		// console.log("Users", users)
		// console.log("Rooms", rooms)
		if(error) {
			return socket.emit('message', error)
		}
		listSockets.push(socket)
		let newPlayer = new Player(_id)
		if(roomControl === 1) {
			newPlayer.x = 1130
			newPlayer.direction = "left"
		}
		listPlayers.push(newPlayer)

		socket.join(user.room)
		io.to(user.room).emit('message', user.username + ' is here!')

		let yourPlayer = newPlayer
	})

	//When someone disconnected
	socket.on('disconnect', () => {
		const _id = socket.id
		const {error, roomName} = removeUser(_id)

		let index = getPlayerIndex(_id)

		if(index !== null)
			listPlayers.splice(index, 1)

		let indexSocket = getSocketIndex(_id)

		if(indexSocket !== null)
			listSockets.splice(indexSocket, 1)

		socket.broadcast.to(roomName).emit('message', 'Your enemy has left!')
	})

	socket.on('keyPress', ({inputId, state}) => {
		let player = getPlayer(socket.id)
		if(player !== null && player.startGame == false && player.roundStart === true && player.playerIsDead === false){
			if(inputId === 'up') {
				if(state === true)
					player.pressingUp = true
				else 
					player.pressingUp = false
			}
			else if(inputId === 'first_attack') {
				if(state === true)
					player.pressingFirstAttack = true
				else 
					player.pressingFirstAttack = false
			}
			else if(inputId === "kame" && player.mana >= player.maxMana) {
				player.mana = 0
				if(state === true)
					player.pressingKame = true
				else 
					player.pressingKame = false
			}
			else if(inputId === 'right') {
				if(state === true)
					player.pressingRight = true
				else 
					player.pressingRight = false
			}
			else if(inputId === 'down') {
				if(state === true)
					player.pressingDown = true
				else 
					player.pressingDown = false
			}		
			else if(inputId === 'left') {
				if(state === true)
					player.pressingLeft = true
				else 
					player.pressingLeft = false
			}
		}
	}) 
}) 

setInterval(function() {
	sendData()
}, 13)

const sendData = () =>{
	let rooms = getAllTheRooms()
	//console.log(rooms)
	rooms.forEach((room) => {
		let usersInThisRoom = getUsersInThisRoom(room)
		usersInThisRoom.forEach((user) => {
			let yourPlayer = getPlayer(user._id)
			let enemyPlayerId = getEnemyId(user.room, user._id)
			let enemyPlayer = null

			listPlayers.forEach((player) => {
				if(player.id === enemyPlayerId)
					enemyPlayer = player
			})
			if(yourPlayer !== null)
				yourPlayer.update()

			let socketIndex = getSocketIndex(user._id)
			checkAttaks(yourPlayer, enemyPlayer)
			if(enemyPlayer !== null){
				if(yourPlayer.startGame === false && enemyPlayer.startGame === false) {
					if(yourPlayer.delayStartRound === null && enemyPlayer.delayStartRound === null){
						yourPlayer.delayStartRound = 799
						enemyPlayer.delayStartRound = 799
					}
					if(yourPlayer.delayStartRound <= 0 && enemyPlayer.delayStartRound <= 0){
						yourPlayer.roundStart = true
						enemyPlayer.roundStart = true
					}
					else {
						if(yourPlayer.delayStartRound <= 210 && enemyPlayer.delayStartRound <= 210) {
							yourPlayer.delayStartRound = 0
							enemyPlayer.delayStartRound = 0
						}
						yourPlayer.delayStartRound--
						enemyPlayer.delayStartRound--
					}
				}
			}
			let enemyUser, yourUser			
			if(enemyPlayer !== null){
				enemyUser = getUser(enemyPlayerId)
				yourUser = getUser(user._id)
			}
			if(yourPlayer.health <= 0 && enemyPlayer != null) {
				yourPlayer.playerIsDead = true
				enemyPlayer.playerIsDead = true
				if(yourPlayer.playerIsDeadDelay >= 0){
					let winner = 1
					let message = enemyUser.username + " has won!"
					listSockets[socketIndex].emit('winMessage', {message, yourPlayer, enemyPlayer, winner})
					yourPlayer.playerIsDeadDelay--
				}
				else 
					listSockets[socketIndex].emit("message", "Your enemy has left!")
			}
			else if(enemyPlayer != null && enemyPlayer.health <= 0){
				yourPlayer.playerIsDead = true
				enemyPlayer.playerIsDead = true
				if(yourPlayer.playerIsDeadDelay >= 0){
					let message = yourUser.username + " has won!"
					let winner = 0
					listSockets[socketIndex].emit('winMessage', {message, yourPlayer, enemyPlayer, winner})
					yourPlayer.playerIsDeadDelay--
				}
				else 
					listSockets[socketIndex].emit("message", "Your enemy has left!")
			}
			else{
				listSockets[socketIndex].emit('data', {yourPlayer, enemyPlayer})
			}
		})
	})
}

const getPlayer = (_id) => {
	let playerData = null
	listPlayers.forEach((player) => {
		if(player.id === _id){
			playerData = player
		}
	})
	return playerData
}

const getPlayerIndex = (_id) => {
	for(let i = 0; i < listPlayers.length; ++i) {
		if(listPlayers[i].id === _id)
			return i
	}
	return null
}

const getSocketIndex = (_id) => {
	for(let i = 0; i < listSockets.length; ++i) {
		if(listSockets[i].id === _id)
			return i
	}
	return null
}

const checkAttaks = (yourPlayer, enemyPlayer) => {
	if(enemyPlayer !== null){
		if(yourPlayer.inTheKame == true && distBetweenPlayersForKame(yourPlayer,enemyPlayer)) {
			enemyPlayer.health -= yourPlayer.kameDamage
			enemyPlayer.attacked = true
			enemyPlayer.attackedTimeFinal = 30
		}
		if(yourPlayer.attacking == true && enemyPlayer.attacking == false) {
			if(yourPlayer.typeOfAttack == "first_attack" && distBetweenPlayers(yourPlayer, enemyPlayer) == true) {
				enemyPlayer.health -= yourPlayer.firstAttackDamage
				if(yourPlayer.mana <= yourPlayer.maxMana)
					yourPlayer.mana += 1
				enemyPlayer.attacked = true
				enemyPlayer.attackedTimeFinal = 30
			}
		}
		else if(distBetweenPlayers(yourPlayer, enemyPlayer) === true && distBetweenPlayers(enemyPlayer, yourPlayer) === false && yourPlayer.attacking == true) {
			enemyPlayer.health -= yourPlayer.firstAttackDamage
			if(yourPlayer.mana <= yourPlayer.maxMana)
				yourPlayer.mana += 1
			enemyPlayer.attacked = true
			enemyPlayer.attackedTimeFinal = 30
		}
	}
}

const distBetweenPlayers = (yourPlayer, enemyPlayer) => {
	let yourPlayerX1 = yourPlayer.x
	let yourPlayerX2 = yourPlayer.x + yourPlayer.width
	let yourPlayerY = yourPlayer.y

	let enemyPlayerX1 = enemyPlayer.x
	let enemyPlayerX2 = enemyPlayer.x + enemyPlayer.width
	let enemyPlayerY = enemyPlayer.y

	// let distX1X1 = Math.abs(yourPlayerX1 - enemyPlayerX1)
	// let distX1X2 = Math.abs(yourPlayerX1 - enemyPlayerX2)
	// let distX2X1 = Math.abs(yourPlayerX2 - enemyPlayerX1)
	// let distX2X2 = Math.abs(yourPlayerX2 - enemyPlayerX2)

	let distY1Y2 = Math.abs(yourPlayerY - enemyPlayerY)

	if(distY1Y2 <= 40) {
		if((yourPlayerX1 <= enemyPlayerX2 && yourPlayerX1 >= enemyPlayerX1 && yourPlayerX2 >= enemyPlayerX2 - 10 && yourPlayer.direction === "left") ||
		   (yourPlayerX2 >= enemyPlayerX1 && yourPlayerX2 <= enemyPlayerX2 && yourPlayerX1 <= enemyPlayerX1 + 10 && yourPlayer.direction === "right"))
			return true

		return false
	}
	return false
} 

const distBetweenPlayersForKame = (yourPlayer, enemyPlayer) => {
	let nr = Math.floor(yourPlayer.inTheKameStart / 8)
	let yourPlayerX1 = yourPlayer.x
	let yourPlayerX2 = yourPlayer.x + yourPlayer.width
	let yourPlayerY = yourPlayer.y

	let enemyPlayerX1 = enemyPlayer.x
	let enemyPlayerX2 = enemyPlayer.x + enemyPlayer.width
	let enemyPlayerY = enemyPlayer.y

	let distX1X1 = Math.abs(yourPlayerX1 - enemyPlayerX1)
	let distX1X2 = Math.abs(yourPlayerX1 - enemyPlayerX2)
	let distX2X1 = Math.abs(yourPlayerX2 - enemyPlayerX1)
	let distX2X2 = Math.abs(yourPlayerX2 - enemyPlayerX2)

	if(yourPlayerY <= enemyPlayerY + enemyPlayer.height) {
		if(yourPlayer.direction == "left") {
			if( yourPlayerX1 >= enemyPlayerX1 && distX1X2 <= nr * 150)
				return true
		}
		if(yourPlayer.direction == "right") {
			if( yourPlayerX2 <= enemyPlayerX2 && distX2X1 <= nr * 150)
				return true
		}
	}
	return false
}

server.listen(port, () => {
	console.log('Server is running..')
})