import React from 'react'
import './Backdrop.css'
const Backdrop = props => {
  return <div className='backdrop'>{props.children}</div>
}
export default Backdrop
