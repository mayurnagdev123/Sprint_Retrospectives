import socket from '../socket_instance/socket_instance'

export function updateColumnHeading (columnNumber, newHeading, callback) {
  let data = {
    columnNumber: columnNumber,
    newHeading: newHeading
  }
  socket.emit('updateColumnHeading', data, function (returnVal, error) {
    console.log('response from server was', returnVal)
    if (error) callback(error.toString())
    else callback(returnVal)
  })
}

export async function requestAllHistoryForExcel (callback) {
  socket.emit('allDataForExcel', function (returnVal, error) {
    console.log('excel respnse from server is ', returnVal)
    if (error) callback(error.toString())
    else callback(returnVal)
  })
}
