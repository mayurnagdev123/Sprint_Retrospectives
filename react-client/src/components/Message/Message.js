import React, { useEffect, useState, useRef } from 'react'
import socket from '../../socket_instance/socket_instance'
import './Message.css'
const Message = props => {
  const [modifyMessage, setModifyMessage] = useState(false)
  const [totalVotes, setTotalVotes] = useState(0)
  const messageInputRef = useRef()
  const messageDivRef = useRef()
  const [thumbsUpDisabled, setThumbsUpDisabled] = useState(false)
  const [thumbsDownDisabled, setThumbsDownDisabled] = useState(false)
  let [votesCastByThisClient, setVotesCastByThisClient] = useState(0)

  useEffect(() => {
    setTotalVotes(props.upVotes - props.downVotes)
  }, [props])

  function messageModifiedHandler (e) {
    if (e.key === 'Enter') {
      const updatedMsg = messageInputRef.current.value
      const updatedMsgId = messageDivRef.current.id
      socket.emit('updateMessage', updatedMsg, updatedMsgId)
      setModifyMessage(false)
    }
  }
  function deleteMessageHandler (messageId) {
    socket.emit('deleteMessage', messageId)
  }
  function upVoteMessage (messageId) {
    setVotesCastByThisClient(prevVotes => prevVotes + 1)
    socket.emit('changeVote', messageId, '+')
  }
  function downVoteMessage (messageId) {
    setVotesCastByThisClient(prevVotes => prevVotes - 1)
    socket.emit('changeVote', messageId, '-')
  }
  useEffect(() => {
    if (votesCastByThisClient === 0) {
      setThumbsUpDisabled(false)
      setThumbsDownDisabled(false)
    } else if (votesCastByThisClient === 1) {
      setThumbsUpDisabled(true)
      setThumbsDownDisabled(false)
    } else if (votesCastByThisClient === -1) {
      setThumbsUpDisabled(false)
      setThumbsDownDisabled(true)
    }
  }, [votesCastByThisClient])
  return (
    <div
      className='card text-dark mb-3 animationDiv'
      id={props.id}
      ref={messageDivRef}
    >
      <div className='card-body '>
        {!modifyMessage ? (
          <div>
            <p className='card-text messageText'>
              {props.text}{' '}
              <span className='badge bg-light text-dark text-light votes'>
                {totalVotes}
              </span>
            </p>

            <span onClick={props.modifyMessage}>
              <i
                className='smallPencil'
                title='Edit'
                onClick={() => setModifyMessage(true)}
              ></i>
            </span>
          </div>
        ) : (
          <div className='input-group input-group-lg'>
            <input
              type='text'
              className='form-control'
              defaultValue={props.text}
              autoFocus={true}
              ref={messageInputRef}
              onKeyDown={messageModifiedHandler}
            />
          </div>
        )}
      </div>
      <div className='additionalItems'>
        <span>
          <button
            className='dustbin transparentBtn'
            title='Delete'
            onClick={() => deleteMessageHandler(messageDivRef.current.id)}
          ></button>
        </span>
        <span>
          <button
            title='Up Vote'
            className='thumbsUp transparentBtn'
            onClick={() => upVoteMessage(messageDivRef.current.id)}
            disabled={thumbsUpDisabled}
          ></button>
        </span>
        <span>
          <button
            title='Down Vote'
            className='thumbsDown transparentBtn'
            onClick={() => downVoteMessage(messageDivRef.current.id)}
            disabled={thumbsDownDisabled}
          ></button>
        </span>
      </div>
    </div>
  )
}
export default Message
