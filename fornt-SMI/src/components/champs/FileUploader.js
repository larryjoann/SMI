import React, { useState } from 'react'
import { CFormInput, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilFile } from '@coreui/icons'

const FileUploader = ({ files, setFiles, label = "Pièces jointes" }) => {

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files))
  }

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove))
  }

  return (
    <div>
      <CFormInput
        type="file"
        multiple
        onChange={handleFileChange}
        className="mb-2"
        aria-label={label}
      />
      {files.length > 0 && (
        <div className="d-flex flex-wrap">
          {files.map((file, index) => (
            <div
              key={index}
              className="file-card d-flex flex-column align-items-center p-2 m-1 border rounded"
              style={{ width: '120px', position: 'relative', background: '#f8f9fa', cursor: 'default' }}
            >
              <CIcon icon={cilFile} size="xl" />
              <small className="text-truncate" style={{ maxWidth: '100%' }}>
                {file.name}
              </small>
              <CButton
                color="danger"
                size="sm"
                className="file-remove-btn"
                onClick={() => removeFile(index)}
                style={{ position: 'absolute', top: 0, right: 0 }}
              >
                ×
              </CButton>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUploader
