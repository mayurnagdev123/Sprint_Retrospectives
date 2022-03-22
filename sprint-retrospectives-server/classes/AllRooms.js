class AllRooms {

    constructor() {
        this.rooms = [];
    }
	 addRoom(room) {
        this.rooms.push(room);
    }
    roomExists(id) {
        return this.rooms.find((room) => room.roomId === id)
    }
    getAllRooms() {
        return this.rooms
    }



}
let allRooms = new AllRooms();
module.exports = allRooms