import React, { useEffect, useState } from 'react'
import socket from '../../socket_instance/socket_instance'
import Spinner from '../Spinner/Spinner'
import './Home.css'
const Home = props => {
  const [retrospectiveId, setRetrospectiveId] = useState(null)
  const [showSpinner, setShowSpinner] = useState(false)

  useEffect(() => {
    socket.on('connect', () => {})
  }, [])

  function createRetrospective () {
    socket.emit('create_retrospective', null, function (id) {
      setRetrospectiveId(id)
      setShowSpinner(true)
    })
  }
  useEffect(() => {
    setTimeout(() => {
      if (retrospectiveId != null) {
        props.history.replace({
          pathname: '/retrospectives',
          search: `id=${retrospectiveId}`,
          state: 'HOST'
        })
      }
    }, 1400)
  }, [retrospectiveId, props.history])

  return showSpinner ? (
    <Spinner />
  ) : (
    <div className='home'>
      <div className='homeHeading row'>
        <div className='col-12'>
          <span className='greenText'>FUN</span>RETROSPECTIVES
        </div>
      </div>
      <div className='homeSubHeading row'>
        <div className='col-12'>
          <span>
            Activities and ideas for making agile retrospectives more engaging
          </span>
        </div>
      </div>
      <div className='row'>
        <div className='col-12'>
          <button
            className='btn btn-dark btn-lg homeButton'
            onClick={createRetrospective}
          >
            Create retrospective
          </button>
        </div>
      </div>
    </div>
  )
}
export default Home
