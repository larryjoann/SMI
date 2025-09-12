import React, { useState } from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow,
  CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton ,CFormInput,
  CForm, CFormLabel , CInputGroup,
  CInputGroupText, CFormSelect
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'


const Tableau_indicateur = () => {
  const [visible, setVisible] = useState(false)
  const [modalValue, setModalValue] = useState(null)

  // Fonction pour ouvrir le modal avec la valeur cliquée
  const handleCellClick = (value) => {
    setModalValue(value)
    setVisible(true)
  }

  return (
    <CRow>
      <CCol xs={12} className="d-flex justify-content-end">
        <CButton
        color='primary'
        key='1'
        shape="rounded-pill"
        className="mb-3"
        href='#/indicateur/form'
        >
          <CIcon icon={cilPlus} className="me-2" />
          Nouvelle indicateur
        </CButton>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Filtre</strong> 
          </CCardHeader>
          <CCardBody> 
              <CForm className="row g-3">
                <CCol sm={4}>
                  <CFormSelect id="autoSizingSelect">
                    <option value="1">Achat</option>
                    <option value="2">Aéronef</option>               
                  </CFormSelect>
                </CCol>
                <CCol sm={2}>
                  <CFormSelect id="autoSizingSelect">
                    <option value="1">2025</option>
                    <option value="2">2024</option>               
                  </CFormSelect>
                </CCol>
                <CCol sm={5}>
                  <CFormInput placeholder="Indicateur..." aria-label="indicateur" />
                </CCol>
                <CCol sm={1}>
                  <CButton color="primary" type="submit">
                    Filtrer
                  </CButton>
                </CCol>
              </CForm>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Processus :</strong> <small>Achat 2024</small>
          </CCardHeader>
          <CCardBody>
            <div style={{ overflowX: 'auto' }}>
              <CTable bordered style={{ minWidth: '2500px', textAlign: 'center' }}>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell style={{ width: '15%' }}>Indicateur</CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '12%' }}>Cible</CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '9%' }}>Fréquence</CTableHeaderCell>
                    {['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'].map((mois, index) => (
                      <CTableHeaderCell key={index} style={{ width: '3%' }}>{mois}</CTableHeaderCell>
                    ))}
                    <CTableHeaderCell style={{ width: '15%' }}>Objectif</CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '15%' }}>Objectif Strategique</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {[
                    {
                      id : 1,
                      indicateur: "taux de fournisseurs sensibles évalués",
                      cible: "≥ 60%",
                      frequence: "Mensuelle",
                      pas_en_mois: 1,
                      valeurs: [52, 52, 64, 74, 65, 74, 85, 14, 55, 32, 85, 32],
                      objectif: "Mesurer la performance des fournisseurs sensibles",
                      objectifStrategique: "Mesurer la performance des fournisseurs sensibles"
                    },
                    {
                      id : 2,
                      indicateur: "taux de fournisseurs sensibles non-evalué",
                      cible: "≥ 80%",
                      frequence: "Trimestrielle",
                      pas_en_mois: 3,
                      valeurs: [57, 56, 63, 54,],
                      objectif: "Mesurer la performance des fournisseurs sensibles",
                      objectifStrategique: "Mesurer la performance des fournisseurs sensibles"
                    }
                  ].map((row, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{row.indicateur}</CTableDataCell>
                      <CTableDataCell>{row.cible}</CTableDataCell>
                      <CTableDataCell>{row.frequence}</CTableDataCell>
                      {row.valeurs.map((val, i) => (
                        <CTableDataCell
                          colSpan={row.pas_en_mois}
                          key={i}
                          style={{ cursor: 'pointer', backgroundColor: '#faf9f8ff' }}
                          onClick={() => handleCellClick(val)}
                        >
                          {val}
                        </CTableDataCell>
                      ))}
                      <CTableDataCell>{row.objectif}</CTableDataCell>
                      <CTableDataCell>{row.objectifStrategique}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>

            {/* MODAL */}
            <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)}>
              <CModalHeader>
                <CModalTitle>Détail de la valeur</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CForm className="row">
                  <CCol md={12} className='mb-2'>
                    <CFormLabel className='mb-0'><strong>Indicateur :</strong></CFormLabel> <br></br>
                    <text>Taux de fournisseurs sensibles évalués</text>
                  </CCol>
                  <CCol md={12} className='mb-2'>
                    <CFormLabel className='mb-0'><strong>Objectif :</strong></CFormLabel> <br></br>
                    <text>Mesurer la performance des fournisseurs sensibles</text>
                  </CCol>
                  <CCol md={12} className='mb-2'>
                    <CFormLabel className='mb-0'><strong>Objectif Strategique :</strong></CFormLabel> <br></br>
                    <text>Mesurer la performance des fournisseurs sensibles</text>
                  </CCol>
                  <CCol md={12} className='mb-2'>
                    <CFormLabel className='mb-0'><strong>Période :</strong></CFormLabel> <br></br>
                    <text>Trimestre 2</text>
                  </CCol>
                  <CCol md={12} className='mb-2'>
                    <CFormLabel className='mb-0'><strong>Cible :</strong></CFormLabel> <br></br>
                    <text>15 % des achats</text>
                  </CCol>                  
                  <CCol md={12}>
                    <CFormLabel htmlFor=""><strong>Valeur :</strong></CFormLabel>
                    <CInputGroup>
                      <CFormInput id="valeur" placeholder="" value={modalValue} />
                      <CInputGroupText>%</CInputGroupText>
                    </CInputGroup>
                  </CCol>
                </CForm>
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>
                  Fermer
                </CButton>
                <CButton color="primary">Enregistrer</CButton>
              </CModalFooter>
            </CModal>
          </CCardBody>
        </CCard>
      </CCol>
      
    </CRow>
  )
}

export default Tableau_indicateur
