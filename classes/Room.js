class Room {
  constructor (roomId) {
    this.roomId = roomId
    this.wentWell = []
    this.didNotGoWell = []
    this.actionItems = []
    this.columnNames = ['Worked well', 'Did not go well', 'Action Items']
    this.counter = 0
  }
  addActionItem (message) {
    this.actionItems.push(message)
  }
  addWentWell (message) {
    this.wentWell.push(message)
  }
  addDidNotGoWell (message) {
    this.didNotGoWell.push(message)
  }
  getWentWellMessages () {
    return this.wentWell
  }
  getDidNotGoWellMessages () {
    return this.didNotGoWell
  }
  getActionItemsMessages () {
    return this.actionItems
  }
  setWentWellMessages (array) {
    this.wentWell = [...array]
  }
  setDidNotGoWellMessages (array) {
    this.didNotGoWell = [...array]
  }
  setActionItemsMessages (array) {
    this.actionItems = [...array]
  }
  getAllData () {
    let allData = {
      wentWell: this.wentWell,
      didNotGoWell: this.didNotGoWell,
      actionItems: this.actionItems,
      columnNames: this.columnNames
    }
    return allData
  }
  getCurrentCounter () {
    return this.counter
  }
  incrementCounter () {
    this.counter = this.counter + 1
  }

  updateColumnName (index, newColumnName) {
    this.columnNames[index] = newColumnName
  }
  getColumnHeadingNames () {
    let columnNames = {
      columnNames: this.columnNames
    }
    return columnNames
  }
}
let room = new Room()
module.exports = Room
