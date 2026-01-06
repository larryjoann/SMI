import React from 'react';
import { CAlert, CRow, CCol } from '@coreui/react';
import CIcon from '@coreui/icons-react';

const Notification = ({ color,title, message, date }) => {
  // Determine how to apply icon color: if iconColor is a hex/rgb value use inline style,
  // otherwise assume a semantic class like 'warning' and use CoreUI/Bootstrap text-* class.
  const isRawColor = typeof iconColor === 'string' && (iconColor.startsWith('#') || iconColor.startsWith('rgb'))

  return (
    <CAlert color={color} className="d-flex align-items-center c-alert">
      <CRow className="w-100 align-items-center">
        {/* <CCol xs="auto">
          <CIcon icon={icon} width={24} height={24} className={iconClass} style={iconStyle} />
        </CCol> */}
        <CCol>
          <h6 className="m-0">{title}</h6>
          <div>{message}</div>
          <div>{date}</div>
        </CCol>
      </CRow>
    </CAlert>
  )
}

export default Notification;
