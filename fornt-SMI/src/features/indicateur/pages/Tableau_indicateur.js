import React, { useState } from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow,
  CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton ,CFormInput,
  CForm, CFormLabel , CInputGroup,
  CInputGroupText, CFormSelect,
  CAccordion, CAccordionBody, CAccordionHeader, CAccordionItem
} from '@coreui/react' 
import CIcon from '@coreui/icons-react'
import { cilPlus, cilStar } from '@coreui/icons'
import useIndicateurs from '../hooks/useIndicateurs'
import ProcessusSelect from '../../../components/champs/ProcessusSelect' 


const Tableau_indicateur = () => {
  const [visible, setVisible] = useState(false)
  const [modalValue, setModalValue] = useState({ value: null, unit: '' })
  const [selectedProcessus, setSelectedProcessus] = useState('')
  const [processusName, setProcessusName] = useState('')

  const MONTHS = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec']

  // Fonction pour ouvrir le modal avec la valeur cliquée (saisie même si la valeur est nulle)
  const handleCellClick = (value, unit = '', row = {}, index = 0, atteint = null) => {
    const pas = row.pas_en_mois || 1
    const startMonth = index * pas
    const endMonth = Math.min(startMonth + pas - 1, MONTHS.length - 1)
    let period = ''
    if (pas === 3) {
      const trimestre = Math.floor(startMonth / 3) + 1
      period = `Trimestre ${trimestre} (${MONTHS[startMonth]} - ${MONTHS[endMonth]})`
    } else if (pas === 12) {
      period = 'Année'
    } else if (pas === 1) {
      period = MONTHS[startMonth]
    } else {
      period = `${MONTHS[startMonth]} - ${MONTHS[endMonth]}`
    }
    // si pas de valeur, initialiser à chaîne vide pour permettre la saisie
    setModalValue({ value: value ?? '', unit, period, target: row.cible, atteint })
    setVisible(true)
  }

  // Fonction pour obtenir la couleur de background en fonction de estAtteint
  const getBackgroundColor = (atteint) => {
    if (atteint === true) {
      return '#d4edda' // vert clair
    } else if (atteint === false) {
      return '#f8d7da' // rouge clair
    }
    return '#faf9f8ff' // couleur par défaut
  }

  const { indicateurs, loading, error, reload } = useIndicateurs()

  return (
    <CRow>
      <CCol xs={12} className="d-flex justify-content-end">
        <CButton
        color='primary'
        key='1'
        className="mb-3 me-1"
        href=''
        >
          <CIcon icon={cilStar} className="me-2" />
          Gestion des objectifs
        </CButton>
        <CButton
        color='primary'
        key='1'
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
                  <ProcessusSelect 
                    id="processusFilter"
                    value={selectedProcessus}
                    onChange={(e) => {
                      setSelectedProcessus(e.target.value)
                      const selectedOption = e.target.options[e.target.selectedIndex]
                      setProcessusName(selectedOption.text)
                    }}
                  />
                </CCol>
                <CCol sm={2}>
                  <CFormSelect id="autoSizingSelect">
                    <option value="">Tous</option>
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
            <strong>Processus :</strong>
          </CCardHeader>
          <CCardBody>
            {loading && <div>Chargement...</div>}
            {error && <div className="text-danger">Erreur de chargement</div>}
            <div style={{ overflowX: 'auto' }}>
              <CTable bordered style={{ minWidth: '1500px', textAlign: 'center' }}>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell style={{ width: '25%' }} >Indicateur</CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '15%' }} >Cible</CTableHeaderCell>                   
                    {['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'].map((mois, index) => (
                      <CTableHeaderCell key={index} style={{ width: '5%' }}>{mois}</CTableHeaderCell>
                    ))}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {indicateurs.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan={14} className="text-center">Aucune donnée</CTableDataCell>
                    </CTableRow>
                  ) : indicateurs.map((row, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell className="align-middle">
                        <CAccordion flush>
                          <CAccordionItem itemKey={row.id}>
                            <CAccordionHeader>{row.indicateur}</CAccordionHeader>
                            <CAccordionBody className='p-1 align-left'>
                              <p><strong>Objectif:</strong> {row.objectif}</p>
                              <p><strong>Objectif stratégique:</strong> {row.objectifStrategique}</p>
                            </CAccordionBody>
                          </CAccordionItem>
                        </CAccordion>
                      </CTableDataCell>
                      <CTableDataCell className="align-middle">{row.cible}</CTableDataCell>

                      {row.valeurs.map((val, i) => (
                        <CTableDataCell className="align-middle"
                          colSpan={row.pas_en_mois}
                          key={i}
                          style={{ cursor: 'pointer', backgroundColor: getBackgroundColor(row.estAtteint?.[i]) }}
                          onClick={() => (handleCellClick(val, row.uniteAbr, row, i, row.estAtteint?.[i]))}
                        >
                          {val != null ? `${val}${row.uniteAbr || ''}` : '-'}
                        </CTableDataCell>
                      ))} 

                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>

            {/* MODAL */}
            <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)}>
              <CModalHeader>
                <CModalTitle>Saise de valeur</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CForm className="row">
                  <CCol md={12} className='mb-2'>
                    <CFormLabel className='mb-0'><strong>Période :</strong></CFormLabel> <br />
                    <span>{modalValue?.period || '-'}</span>
                  </CCol>
                  <CCol md={12} className='mb-2'>
                    <CFormLabel className='mb-0'><strong>Cible :</strong></CFormLabel> <br />
                    <span>{modalValue?.target ?? '-'}</span>
                  </CCol>                  
                  <CCol md={12}>
                    <CFormLabel htmlFor=""><strong>Valeur :</strong></CFormLabel>
                    <CInputGroup>
                      <CFormInput id="valeur" placeholder="" value={modalValue?.value ?? ''} onChange={(e) => setModalValue(prev => ({ ...prev, value: e.target.value }))} />
                      <CInputGroupText>{modalValue?.unit || ''}</CInputGroupText>
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
