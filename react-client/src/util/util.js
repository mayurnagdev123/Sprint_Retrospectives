import socket from '../socket_instance/socket_instance'

export function updateColumnHeading (columnNumber, newHeading, callback) {
  let data = {
    columnNumber: columnNumber,
    newHeading: newHeading
  }
  socket.emit('updateColumnHeading', data, function (returnVal, error) {
    if (error) callback(error.toString())
    else callback(returnVal)
  })
}

export async function requestAllHistoryForExcel (callback) {
  socket.emit('allDataForExcel', function (returnVal, error) {
    if (error) callback(error.toString())
    else callback(returnVal)
  })
}
