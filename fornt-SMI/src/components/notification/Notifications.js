import React from 'react';
import { CAlert, CRow, CCol } from '@coreui/react';
import CIcon from '@coreui/icons-react';

const Notification = ({ color, icon, title, message, date }) => (
  <CAlert color={color} className="d-flex align-items-center c-alert">
    <CRow className="w-100 align-items-center">
      <CCol xs="auto">
        <CIcon icon={icon} width={24} height={24} />
      </CCol>
      <CCol>
        <h6 className="m-0">{title}</h6>
        <div>{message}</div>
        <div>{date}</div>
      </CCol>
    </CRow>
  </CAlert>
);

export default Notification;
