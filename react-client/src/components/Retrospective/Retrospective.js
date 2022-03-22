import React, { useCallback, useEffect, useState } from 'react'
import socket from '../../socket_instance/socket_instance'
import ActionItems from '../ActionItems/ActionItems'
import Backdrop from '../Backrop/Backdrop'
import DidNotGoWell from '../DidNotGoWell/DidNotGoWell'
import Modal from '../Modal/Modal'
import WentWell from '../WentWell/WentWell'
import './Retrospective.css'
const Retrospective = props => {
  const [error, setError] = useState(null)
  const [columnNames, setColumnNames] = useState([])
  const [wentWellMessages, setWentWellMessages] = useState([])
  const [didNotGoWellMessages, setDidNotGoWellMessages] = useState([])
  const [actionItemsMessages, setActionItemsMessages] = useState([])
  const [showLinkShareModal, setShowLinkShareModal] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(props.location.search)
    if (props?.location?.state) {
      // setTimeout(() => {
      //   alert('share the link with your friends so they can join the room')
      // }, 1000)
      setShowLinkShareModal(true)
    }

    let retrospectiveId = urlParams.get('id') || undefined
    socket.emit('joinRoom', retrospectiveId, function (returnVal, error) {
      if (error) {
        setError(error)
      } else {
        setColumnNames(returnVal.columnNames)
      }
    })

    socket.on('allHistory', response => {
      setWentWellMessages(response?.wentWell)
      setDidNotGoWellMessages(response?.didNotGoWell)
      setActionItemsMessages(response?.actionItems)
      setColumnNames(response?.columnNames)
    })
  }, [props, error])

  const sendMessage = useCallback(function addMessage (columnNumber, message) {
    let newMessage = {
      columnNumber: columnNumber,
      message: message
    }
    socket.emit('newMessage', newMessage)
  }, [])

  function closeBackdropAndModal () {
    setShowLinkShareModal(false)
  }

  return (
    <div className='retrospectiveLabel'>
      {error ? (
        <div>
          <h2>Something went wrong :( </h2> <h2>{error}</h2>
        </div>
      ) : null}
      {showLinkShareModal ? (
        <Backdrop>
          <Modal clicked={closeBackdropAndModal} />
        </Backdrop>
      ) : null}
      <div className='row'>
        <div className='col-12 col-md-4'>
          <WentWell
            columnHeading={columnNames[0]}
            sendMessage={sendMessage}
            messages={wentWellMessages}
          />
        </div>
        <div className='col-12 col-md-4'>
          <DidNotGoWell
            columnHeading={columnNames[1]}
            sendMessage={sendMessage}
            messages={didNotGoWellMessages}
          />
        </div>
        <div className='col-12 col-md-4'>
          <ActionItems
            columnHeading={columnNames[2]}
            sendMessage={sendMessage}
            messages={actionItemsMessages}
          />
        </div>
      </div>
    </div>
  )
}
export default Retrospective
