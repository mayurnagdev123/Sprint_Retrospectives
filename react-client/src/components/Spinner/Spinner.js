import React from 'react'
import './Spinner.css'
const Spinner = () => {
  return (
    <div className='spinner'>
      <div className='spinner-grow text-dark spinnerElement' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </div>
      <div className='spinner-grow text-dark spinnerElement' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </div>
      <div className='spinner-grow text-dark spinnerElement' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </div>
    </div>
  )
}
export default Spinner
