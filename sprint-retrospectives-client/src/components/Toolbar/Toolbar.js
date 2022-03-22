import React, { useEffect, useState } from 'react'
import socket from '../../socket_instance/socket_instance'
import ExportToExcel from '../ExportToExcel/ExportToExcel'

import './Toolbar.css'

const Toolbar = () => {
  const [allUsersInRetrospective, setAllUsersInRetrospective] = useState(0)
  useEffect(() => {
    socket.on('updateMembers', totalUsers => {
      console.log('total users in this room are', totalUsers)
      setAllUsersInRetrospective(totalUsers)
    })
  }, [])
  return (
    <div className='toolbar'>
      <div className='row'>
        <div className='col-12 col-md-4 funRetrospectivesHeading'>
          <span className='whiteText'>FUN</span>RETROSPECTIVES
        </div>
        <div className='.d-none .d-sm-block col-md-1'></div>
        {allUsersInRetrospective > 0 ? (
          <div className='col-12 col-md-7 retrospectiveInfoLabel'>
            <button
              type='button'
              className='btn btn-dark usersConnectedBtn toolbarButtons'
            >
              <span> Users connected </span>
              <span className='badge bg-light text-dark'>
                {allUsersInRetrospective}
              </span>
            </button>
            <ExportToExcel />
          </div>
        ) : (
          <div className='col-12 col-md-7 retrospectiveInfoLabel'>
            making agile retrospectives more engaging
          </div>
        )}
      </div>
    </div>
  )
}
export default Toolbar
