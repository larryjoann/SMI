import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <span className="ms-1">&copy; 2025 Ravinala</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">S.M.I by Ravinala Airports</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
