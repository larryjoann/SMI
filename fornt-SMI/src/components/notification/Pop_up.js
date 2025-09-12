import React, { useRef, useState } from 'react'
import { CToast, CToastBody, CToastHeader, CToaster } from '@coreui/react'

export const Pop_up = ({ show, type = 'secondary', message = 'Default message' }) => {
  const [toast, addToast] = useState()
  const toaster = useRef(null)

  const exampleToast = (
    <CToast color={type}>
      <CToastHeader closeButton>
        <div className="fw-bold me-auto">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
      </CToastHeader>
      <CToastBody className='c-toast-body'>
          {message}
      </CToastBody>
    </CToast>
  )

  React.useEffect(() => {
    if (show) {
      addToast(exampleToast)
    }
  }, [show, type, message])

  return (
    <>
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
    </>
  )
}