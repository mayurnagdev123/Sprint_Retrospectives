import React, { useEffect, useState } from 'react'
import './Modal.css'

const Modal = props => {
  const [retrospectiveURL, setRetrospectiveURL] = useState(null)
  const [linkCopied, setLinkCopied] = useState(false)
  useEffect(() => {
    setRetrospectiveURL(window.location.href)
  }, [props])

  function copyLinkToClipboard () {
    navigator.clipboard
      .writeText(retrospectiveURL)
      .then(() => {
        alert('copied successfully')
        setLinkCopied(true)
      })
      .catch(err => {
        alert('something went wrong copying', err.toString())
      })
  }
  return (
    <div className='modal-dialog modal_share_link'>
      <div className='modal-content'>
        <div className='modal-header'>
          <span className='modal-title share_link_text'>Share Link</span>
          <button
            type='button'
            className='btn-close crossButton'
            onClick={props.clicked}
            aria-label='Close'
          ></button>
        </div>
        <div className='modal-body'>
          <div className='input-group row modalDiv'>
            <span className='input-group-text col-2'>
              <i className='link'></i>
            </span>
            <input
              type='text'
              className='form-control inputLink col-5'
              aria-label="Recipient's username"
              aria-describedby='button-addon2'
              disabled
              defaultValue={retrospectiveURL}
            />
            {!linkCopied ? (
              <button
                className='btn-dark modalButtons col-5'
                type='button'
                onClick={copyLinkToClipboard}
              >
                Copy Link
              </button>
            ) : (
              <button
                className='btn btn-lg copiedLinkButton modalButtons col-5'
                type='button'
              >
                Copied!
              </button>
            )}
          </div>
        </div>
        <div className='modal-footer'>
          <button
            type='button'
            className='btn btn-secondary btn-lg btn-block modalButtons'
            onClick={props.clicked}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
export default Modal
