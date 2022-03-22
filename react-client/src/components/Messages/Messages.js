import React, { useEffect, useState } from 'react'
import Message from '../Message/Message'

const Messages = props => {
  const [allMessagesToBeShown, setAllMessagesToBeShown] = useState([])
  useEffect(() => {
    const messages = props.messages
    const allMessages = []

    messages.forEach((element, index) => {
      allMessages.push(
        <Message
          text={element.text}
          key={index}
          id={element.id}
          upVotes={element.upVotes}
          downVotes={element.downVotes}
        />
      )
    })
    if (allMessages.length === messages.length) {
      setAllMessagesToBeShown(allMessages)
    }
  }, [props])
  return <div>{allMessagesToBeShown}</div>
}
export default Messages
