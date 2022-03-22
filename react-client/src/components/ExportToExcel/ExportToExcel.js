import React, { useEffect, useRef, useState } from 'react'
import './ExportToExcel.css'
import { requestAllHistoryForExcel } from '../../util/util'
import { CSVLink } from 'react-csv'
import '../Toolbar/Toolbar.css'

const ExportToExcel = props => {
  const [data, setData] = useState([])
  const [headers, setHeaders] = useState([])
  const [filename, setFilename] = useState(null)
  const excelRef = useRef()

  useEffect(() => {
    const currentRoomId = new URLSearchParams(window.location.search).get('id')
    const fileToDownload = 'retrospective_' + currentRoomId + '.csv'
    setFilename(fileToDownload)
  }, [props])

  useEffect(() => {
    if (headers.length > 0) {
      excelRef.current.link.click()
    }
  }, [headers])

  function requestAllHistory () {
    requestAllHistoryForExcel(function (response, error) {
      let wentWellMessages = response?.wentWell
      let didNotGoWellMessages = response?.didNotGoWell
      let actionItemMessages = response?.actionItems
      let columnNames = response?.columnNames
      let headers = [
        { label: columnNames[0], key: 'wentWell' },
        { label: columnNames[1], key: 'didNotGoWell' },
        { label: columnNames[2], key: 'actionItems' }
      ]
      let finalDataObject = []

      let getMaximumLength = Math.max(
        wentWellMessages.length,
        Math.max(didNotGoWellMessages.length, actionItemMessages.length)
      )
      for (let i = 0; i < getMaximumLength; i++) {
        let localObject = {}
        if (wentWellMessages[i] !== undefined && wentWellMessages[i] !== null) {
          let text = wentWellMessages[i].text
          localObject['wentWell'] = text
        }
        if (
          didNotGoWellMessages[i] !== undefined &&
          didNotGoWellMessages[i] !== null
        ) {
          let text = didNotGoWellMessages[i].text
          localObject['didNotGoWell'] = text
        }
        if (
          actionItemMessages[i] !== undefined &&
          actionItemMessages[i] !== null
        ) {
          let text = actionItemMessages[i].text
          localObject['actionItems'] = text
        }
        finalDataObject.push(localObject)
      }
      setData(finalDataObject)
      setHeaders(headers)
    })
  }

  return (
    <span>
      <button
        type='button'
        className='btn btn-dark toolbarButtons'
        onClick={() => requestAllHistory()}
      >
        <span> Export to Excel </span>
        <span className='download'></span>
      </button>
      <CSVLink
        data={data}
        headers={headers}
        filename={filename}
        ref={excelRef}
        className='hiddenExcel'
        target='_blank'
      ></CSVLink>
    </span>
  )
}
export default ExportToExcel
