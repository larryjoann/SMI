import React from 'react'
import {
  CCard, CCardHeader, CCardBody,
  CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CDropdownDivider
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilOptions, cilTrash, cilPen } from '@coreui/icons'

const ProcessusCard = ({
  title,
  responsable,
  collaborateur,
  onDelete,
  onEdit,
  textBgColor,
  onClick,
}) => (
  <CCard
    className="hover-card"
    style={textBgColor ? { backgroundColor: textBgColor, cursor: 'pointer' } : { cursor: 'pointer' }}
    onClick={onClick}
  >
    <CCardHeader className="text-center position-relative">
      <span className="h6 m-0">{title}</span>
      <div
        className="position-absolute end-0 top-50 translate-middle-y me-2"
        onClick={e => e.stopPropagation()} // <-- Stop propagation sur le conteneur
      >
        <CDropdown alignment="end">
          <CDropdownToggle
            caret={false}
            className="p-0"
          >
            <CIcon icon={cilOptions} className="text-dark" />
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem
              onClick={e => {
                e.stopPropagation()
                onDelete()
              }}
            >
              <CIcon icon={cilTrash} className="text-danger me-3" />
              <span className="text-danger">Supprimer</span>
            </CDropdownItem>
            <CDropdownDivider />
            <CDropdownItem
              onClick={e => {
                e.stopPropagation()
                onEdit()
              }}
            >
              <CIcon icon={cilPen} className="text-warning me-3" />
              <span className="text-warning">Modifier</span>
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </div>
    </CCardHeader>
    <CCardBody className="d-flex flex-column align-items-center text-center">
      <p>{responsable}</p>
      <a>{collaborateur}</a>
    </CCardBody>
  </CCard>
)

export default ProcessusCard