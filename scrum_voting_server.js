const express = require('express')
const app = express()
const socketio = require('socket.io')
const allRooms = require('./classes/AllRooms')
const Room = require('./classes/Room')

app.use(express.static(__dirname + '/public'))
const expressServer = app.listen(process.env.PORT || 3000)
const io = socketio(expressServer, {
  cors: {
    origin: "https://mn-agile-retrospectives.web.app",
    methods: "*"
  }
})
io.of('/').on('connection', socket => {
  socket.emit('message', 'hi from the server')
  let roomBeingLeft = null
  socket.on('disconnecting', reason => {
    roomBeingLeft = Array.from(socket.rooms)[1]
  })
  socket.on('disconnect', () => {
    updateUsersInRoom(roomBeingLeft)
  })

  socket.on('create_retrospective', function (data, callback) {
    try {
      const id = Math.random()
        .toString(16)
        .slice(2)
      const today = new Date()
      var options = { year: 'numeric', month: 'short', day: 'numeric' }
      let newDate = today.toLocaleDateString('en-US', options)
      newDate = newDate.replace(',', '')
      newDate = newDate.replace(/\s/g, '_')

      while (true) {
        if (allRooms.roomExists(id))
          id = Math.random()
            .toString(16)
            .slice(2)
        else {
          let id_with_date = id + '_' + newDate
          let room = new Room(id_with_date)
          allRooms.addRoom(room)
          callback(id_with_date)
          break
        }
      }
    } catch (err) {
      console.log('CreateRetrospective] An error occured', err.toString())
    }
  }) //create-retrospective

  socket.on('joinRoom', function (roomId, callback) {
    try {
      let room = allRooms.roomExists(roomId)
      if (room != undefined) {
        socket.join(room)
        updateUsersInRoom(room)
        callback(room.getAllData(), null)
        broadcastHistoryToAllClients(room)
      } else {
        callback(null, `Error: Invalid Room ${roomId}`)
      }
    } catch (err) {
      console.log('[JoinRoom] An error occured', err.toString())
    }
  }) //end  of joinRoom

  socket.on('updateColumnHeading', function (data, callback) {
    try {
      let currentRoom = Array.from(socket.rooms)[1]
      updateColumnHeadingForAllClients(
        data.columnNumber,
        data.newHeading,
        currentRoom
      )
      callback('success')
    } catch (err) {
      console.log('Update column heading] An error occured', err.toString())
      callback(err.toString())
    }
  }) //updateColumnHeading

  socket.on('allDataForExcel', callback => {
    try {
      let currentRoom = Array.from(socket.rooms)[1]
      callback(currentRoom.getAllData())
    } catch (err) {
      console.log('[Fetching data for excel] An error occured', err.toString())
    }
  })

  socket.on('updateMessage', (updatedMessage, messageId) => {
    try {
      let currentRoom = Array.from(socket.rooms)[1]
      let messageType = messageId.substr(0, 2)
      let pos = 0
      let newMessage = null
      let initialMessage = null
      switch (messageType) {
        case 'WW':
          let wentWellMessages = currentRoom.getWentWellMessages()
          wentWellMessages.every((message, index) => {
            const currentMessageid = message?.id
            if (currentMessageid.localeCompare(messageId) === 0) {
              pos = index
              initialMessage = message
              return false
            }
            return true
          })
          newMessage = { ...initialMessage, text: updatedMessage }
          wentWellMessages[pos] = newMessage
          currentRoom.setWentWellMessages(wentWellMessages)
          break
        case 'DN':
          let didNotGoWellMessages = currentRoom.getDidNotGoWellMessages()
          didNotGoWellMessages.every((message, index) => {
            const currentMessageid = message?.id
            if (currentMessageid.localeCompare(messageId) === 0) {
              pos = index
              initialMessage = message
              return false
            }
            return true
          })
          newMessage = { ...initialMessage, text: updatedMessage }
          didNotGoWellMessages[pos] = newMessage
          currentRoom.setDidNotGoWellMessages(didNotGoWellMessages)
          break
        case 'AI':
          let actionItems = currentRoom.getActionItemsMessages()
          actionItems.every((message, index) => {
            const currentMessageid = message?.id
            if (currentMessageid.localeCompare(messageId) === 0) {
              pos = index
              initialMessage = message
              return false
            }
            return true
          })
          newMessage = { ...initialMessage, text: updatedMessage }
          actionItems[pos] = newMessage
          currentRoom.setActionItemsMessages(actionItems)
          break
        default:
          console.log(
            '[Update Message]Incorrect Message Type provided',
            messageType
          )
      }
      broadcastHistoryToAllClients(currentRoom)
    } catch (err) {
      console.log('[Updating message] An error occured', err.toString())
    }
  }) //end of updateMessage

  socket.on('deleteMessage', messageId => {
    try {
      let currentRoom = Array.from(socket.rooms)[1]
      const messageType = messageId.substr(0, 2)
      switch (messageType) {
        case 'WW':
          let wentWellMessages = currentRoom.getWentWellMessages()
          wentWellMessages = wentWellMessages.filter(
            message => message.id !== messageId
          )
          currentRoom.setWentWellMessages(wentWellMessages)
          break
        case 'DN':
          let didNotGoWellMessages = currentRoom.getDidNotGoWellMessages()
          didNotGoWellMessages = didNotGoWellMessages.filter(
            message => message.id !== messageId
          )
          currentRoom.setDidNotGoWellMessages(didNotGoWellMessages)
          break
        case 'AI':
          let actionItemsMessages = currentRoom.getActionItemsMessages()
          actionItemsMessages = actionItemsMessages.filter(
            message => message.id !== messageId
          )
          currentRoom.setActionItemsMessages(actionItemsMessages)
          break
        default:
          console.log('[Delete Message]Invalid message id being passed')
      }
      broadcastHistoryToAllClients(currentRoom)
    } catch (err) {
      console.log('[Deleting message] An error occured', err.toString())
    }
  }) //end of deleting message

  socket.on('changeVote', (messageId, action) => {
    try {
      let currentRoom = Array.from(socket.rooms)[1]
      let pos = 0
      let initialMessage = null
      const messageType = messageId.substr(0, 2)
      let upVotes = 0
      let downVotes = 0
      let newMessage = 0

      switch (messageType) {
        case 'WW':
          let wentWellMessages = currentRoom.getWentWellMessages()
          wentWellMessages.every((message, index) => {
            const currentMessageid = message?.id
            if (currentMessageid.localeCompare(messageId) === 0) {
              pos = index
              initialMessage = message
              return false
            }
            return true
          })
          upVotes = wentWellMessages[pos].upVotes
          downVotes = wentWellMessages[pos].downVotes
          if (action.localeCompare('+') === 0) {
            newMessage = { ...initialMessage, upVotes: upVotes + 1 }
          } else if (action.localeCompare('-') === 0) {
            newMessage = { ...initialMessage, downVotes: downVotes + 1 }
          }
          wentWellMessages[pos] = newMessage
          currentRoom.setWentWellMessages(wentWellMessages)
          break
        //DN
        case 'DN':
          let didNotGoWellMessages = currentRoom.getDidNotGoWellMessages()
          didNotGoWellMessages.every((message, index) => {
            const currentMessageid = message?.id
            if (currentMessageid.localeCompare(messageId) === 0) {
              pos = index
              initialMessage = message
              return false
            }
            return true
          })
          upVotes = didNotGoWellMessages[pos].upVotes
          downVotes = didNotGoWellMessages[pos].downVotes
          if (action.localeCompare('+') === 0) {
            newMessage = { ...initialMessage, upVotes: upVotes + 1 }
          } else if (action.localeCompare('-') === 0) {
            newMessage = { ...initialMessage, downVotes: downVotes + 1 }
          }
          didNotGoWellMessages[pos] = newMessage
          currentRoom.setDidNotGoWellMessages(didNotGoWellMessages)
          break
        //AI
        case 'AI':
          let actionItemsMessages = currentRoom.getActionItemsMessages()
          actionItemsMessages.every((message, index) => {
            const currentMessageid = message?.id
            if (currentMessageid.localeCompare(messageId) === 0) {
              pos = index
              initialMessage = message
              return false
            }
            return true
          })
          upVotes = actionItemsMessages[pos].upVotes
          downVotes = actionItemsMessages[pos].downVotes
          if (action.localeCompare('+') === 0) {
            newMessage = { ...initialMessage, upVotes: upVotes + 1 }
          } else if (action.localeCompare('-') === 0) {
            newMessage = { ...initialMessage, downVotes: downVotes + 1 }
          }
          actionItemsMessages[pos] = newMessage
          currentRoom.setActionItemsMessages(actionItemsMessages)
          break
        default:
          console.log(
            '[Change Vote]invalid message type passed in to function',
            messageType
          )
      }
      broadcastHistoryToAllClients(currentRoom)
    } catch (err) {
      console.log('[Change Vote] An error occured', err.toString())
    }
  }) //end of changeVote

  socket.on('newMessage', function (data) {
    try {
      let currentRoom = Array.from(socket.rooms)[1]
      addNewMessage(data.columnNumber, data.message, currentRoom)
    } catch (err) {
      console.log('[Adding a new message] An error occured', err.toString())
    }
  }) //end of newMessage
}) //end of io.of("/").on("connection")

async function updateUsersInRoom (room) {
  try {
    const allSockets = await io.in(room).allSockets()
    const clientsInThisRoom = Array.from(allSockets)
    io.in(room).emit('updateMembers', clientsInThisRoom.length)
  } catch (err) {
    console.log('[Updating users in room] An error occured', err.toString())
  }
}
function updateColumnHeadingForAllClients (columnNumber, newHeading, room) {
  try {
    room.updateColumnName(columnNumber - 1, newHeading)
    io.in(room).emit('updatedColumnNames', room.getColumnHeadingNames())
  } catch (err) {
    console.log(
      '[Updating column heading for all clients] An error occured',
      err.toString()
    )
  }
}

function addNewMessage (columnNumber, message, room) {
  try {
    let messageId, messageToAdd
    switch (columnNumber) {
      case 1:
        messageId = 'WW' + room.getCurrentCounter()
        messageToAdd = {
          text: message,
          id: messageId,
          upVotes: 0,
          downVotes: 0
        }
        room.addWentWell(messageToAdd)
        break
      case 2:
        messageId = 'DN' + room.getCurrentCounter()
        messageToAdd = {
          text: message,
          id: messageId,
          upVotes: 0,
          downVotes: 0
        }
        room.addDidNotGoWell(messageToAdd)
        break
      case 3:
        messageId = 'AI' + room.getCurrentCounter()
        messageToAdd = {
          text: message,
          id: messageId,
          upVotes: 0,
          downVotes: 0
        }
        room.addActionItem(messageToAdd)
        break
      default:
        throw new Error('invalid column number specified', columnNumber)
    }
    room.incrementCounter()
    broadcastHistoryToAllClients(room)
  } catch (err) {
    console.log('[Adding new message] An error occured', err.toString())
  }
}
function broadcastHistoryToAllClients (room) {
  try {
    io.in(room).emit('allHistory', room.getAllData())
  } catch (err) {
    console.log(
      '[Broadcast History to all clients] An error occured',
      err.toString()
    )
  }
}
