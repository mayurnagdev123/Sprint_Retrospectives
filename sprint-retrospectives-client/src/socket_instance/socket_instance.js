import { io } from 'socket.io-client'
const URL = '192.168.1.4:9000'
const socket = io(URL)

socket.onAny((event, ...args) => {
  console.log(event, args)
})

export default socket
