import { io } from 'socket.io-client'
const URL = 'https://mn-agile-retrospectives-server.herokuapp.com/'
const socket = io(URL)

//socket.onAny((event, ...args) => {
  //console.log(event, args)
//})

export default socket
