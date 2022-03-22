import React, { useEffect, useRef, useState } from 'react'
import '../../App.css'
import { updateColumnHeading } from '../../util/util'
import socket from '../../socket_instance/socket_instance'
import Messages from '../Messages/Messages'
const ActionItems = props => {
  const [columnHeading, setColumnHeading] = useState('')
  const [showModifyInputHeading, setShowModifyInputHeading] = useState(false)
  const columnHeadingInputRef = useRef()
  const sendMessageInputRef = useRef()
  const [actionItemsMessages, setActionItemsMessages] = useState([])

  function modifyInputHeading () {
    setShowModifyInputHeading(true)
  }
  function columnChangedHandler (e) {
    if (e.key === 'Enter') {
      // setColumnHeading(columnHeadingInputRef.current.value)
      updateColumnHeading(3, columnHeadingInputRef.current.value, function (
        response
      ) {
        console.log('[ActionItems]response was', response)
      })
      setShowModifyInputHeading(false)
    }
  }

  function sendNewMessage (e) {
    if (e.key === 'Enter') {
      //send the message
      props.sendMessage(3, sendMessageInputRef.current.value)
      sendMessageInputRef.current.value = ''
    }
  }

  useEffect(() => {
    setColumnHeading(props.columnHeading)
    setActionItemsMessages(props.messages)
    socket.on('updatedColumnNames', response => {
      let newNameForActionItems = response.columnNames[2]
      setColumnHeading(newNameForActionItems)
    })
  }, [props])
  return (
    <div>
      {!showModifyInputHeading ? (
        <div>
          <span className='columnHeading'>{columnHeading}</span>
          <span onClick={modifyInputHeading}>
            <i className='pencil'></i>
          </span>
        </div>
      ) : (
        <div className='input-group input-group-lg'>
          <input
            type='text'
            className='form-control columnHeadingInput'
            defaultValue={columnHeading}
            onKeyDown={columnChangedHandler}
            ref={columnHeadingInputRef}
            autoFocus={true}
          />
        </div>
      )}

      <div className='input-group input-group-lg'>
        <input
          type='text'
          className='form-control sendMessageInput'
          placeholder='Type in something and hit enter...'
          onKeyDown={sendNewMessage}
          ref={sendMessageInputRef}
        />
      </div>
      <Messages messages={actionItemsMessages} columnName='AI' />
    </div>
  )
}
export default ActionItems
