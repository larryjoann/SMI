import React from 'react'
import { CRow, CCol } from '@coreui/react'
import ProcessusCard from './ProcessusCard'

const CategorieProcessusSection = ({ categorie, processusList, color }) => (
  <>
    {/* <h5 className="mb-3">{categorie}</h5> */}
    <CRow className="justify-content-center mb-2">
      {processusList.map((processus, idx) => (
        <CCol key={idx} sm={4} className="mb-3">
          <ProcessusCard
            title={processus.title}
            responsable={processus.responsable}
            collaborateur={processus.collaborateur}
            onDelete={processus.onDelete}
            onEdit={processus.onEdit}
            textBgColor={color}
            onClick={processus.onClick} // <-- Ajout ici
          />
        </CCol>
      ))}
    </CRow>
  </>
)

export default CategorieProcessusSection