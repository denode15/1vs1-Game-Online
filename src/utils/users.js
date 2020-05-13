const users = []
const rooms = []

const addUser = (user) => {
	let ok = true
	let roomControl = 0
	users.forEach((user_i) => {
		if(user_i.username === user.username){
			ok = false
		}
	})
	if(ok === true){
		rooms.forEach((room_i) => {
			if(room_i.name === user.room){
				if(room_i.count >= 2){
					roomControl = 2
				}
				else if(room_i.count === 1) {
					roomControl = 1
					room_i.count = 2
				}
			}
		})
	}
	if(roomControl !== 2){
		if(roomControl === 0 && ok === true) {
			rooms.push({name: `${user.room}`, count: 1})
		}
		if(ok === true){
			users.push(user)
		}
		else {
			return {error: "Username is taken!"}
		}
		return {user, rooms, users, roomControl}
	}
	else {
		return {error: "This room is full!"}
	}
}

const removeUser = (id) => {

	let index = null, roomName = null;
	for(let i = 0; i < users.length; ++i) {
		if(users[i]._id === id) {
			roomName = users[i].room;
			index = i;
		}
	}
	if(index !== null && roomName !== null) {
		users.splice(index, 1)
		let roomIndex = null
		for(let i = 0; i < rooms.length; ++i) {
			if(rooms[i].name === roomName) {
				roomIndex = i;
				break
			}	
		}
		secondUser = null
		for(let i = 0; i < users.length; ++i) {
			if(users[i].room === roomName) {
				secondUser = i
			}
		}
		if(secondUser !== null)
			users.splice(secondUser, 1)
		rooms.splice(roomIndex, 1)
		return {roomName, users, rooms}
	}
	return {
		error: "Nothing",
		users,
		rooms,
	}
}

const getUser = (_id) => {
	let user1 = null
	users.forEach((user) => {
		if(user._id === _id)
			user1 = user
	})
	return user1	
}

const getEnemyId = (room, _id) => {
	let enemyId = null
	users.forEach((user) => {
		if(user.room === room && user._id !== _id){
			enemyId = user._id
		}
	})
	return enemyId
}

const getAllTheRooms = () => {
	return rooms
}

const getUsersInThisRoom = (room) => {
	let usersInThisRoom = []
	users.forEach((user) => {
		if(user.room === room.name)
			usersInThisRoom.push(user)
	})
	return usersInThisRoom
}

module.exports = {
	addUser,
	removeUser,
	getEnemyId,
	getUser,
	getAllTheRooms,
	getUsersInThisRoom,
}