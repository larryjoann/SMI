import React, { useEffect, useState } from 'react'
import {
  CCol,
  CRow,
  CCard, CCardBody, CCardHeader, 
  CForm, CFormInput, CFormSelect, CButton,  
  CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

import CIcon from '@coreui/icons-react'
import { cilPlus, cilWarning, cilFilter , cilFilterX } from '@coreui/icons'
import CategorieProcessusSection from '../components/CategorieProcessusSection'
import API_URL from '../../../api/API_URL'
import CategorieProcessusSelect from '../../../components/champs/CategorieProcessusSelect'
import { Pop_up } from '../../../components/notification/Pop_up' // Ajoute l'import

const Cartographie = () => {
  const [processus, setProcessus] = useState([])
  const [categories, setCategories] = useState([])
  // Etats pour le filtre
  const [inputNom, setInputNom] = useState('')
  const [inputCategorie, setInputCategorie] = useState('')
  const [inputYear, setInputYear] = useState('')
  const [filterNom, setFilterNom] = useState('')
  const [filterCategorie, setFilterCategorie] = useState('')
  const [filterYear, setFilterYear] = useState('')
  const [availableYears, setAvailableYears] = useState([])
  // Pour le modal de suppression
  const [modalVisible, setModalVisible] = useState(false)
  const [processusToDelete, setProcessusToDelete] = useState(null)

  // Pour le Pop_up
  const [showToast, setShowToast] = useState(false)
  const [popType, setPopType] = useState('success')
  const [popMessage, setPopMessage] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    // Récupérer les processus
    fetch(`${API_URL}/Processus`)
      .then(res => res.json())
      .then(data => setProcessus(data))
      .catch(() => setProcessus([]))

    // Récupérer les catégories
    fetch(`${API_URL}/CategorieProcessus`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]))
  }, [])

  // Build available years list from processus.validites; fall back to sensible defaults
  useEffect(() => {
    const years = new Set()
    processus.forEach(p => {
      if (Array.isArray(p.validites)) {
        p.validites.forEach(v => { if (v && v.annee) years.add(v.annee) })
      }
    })
    const sorted = Array.from(years).sort((a, b) => a - b)
    if (sorted.length === 0) {
      const now = new Date().getFullYear()
      setAvailableYears([now, now + 1, now + 2])
    } else {
      setAvailableYears(sorted)
    }
  }, [processus])

  const categorieColors = {
    1: '#A8D5BA',
    2: '#8aa8c8ff',
    3: '#c7d3e7ff',
    4: '#E0E0E0',
  }

  // Demande la confirmation avant suppression
  const askDeleteProcessus = (id) => {
    setProcessusToDelete(id)
    setModalVisible(true)
  }

  // Supprime le processus après confirmation
  const confirmDeleteProcessus = async () => {
    if (!processusToDelete) return
    try {
      const res = await fetch(`${API_URL}/Processus/${processusToDelete}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setProcessus(prev => prev.filter(p => p.id !== processusToDelete))
        setPopType('success')
        setPopMessage('Processus supprimé avec succès')
        setShowToast(true)
      } else {
        setPopType('danger')
        setPopMessage('Erreur lors de la suppression')
        setShowToast(true)
      }
    } catch {
      setPopType('danger')
      setPopMessage('Erreur réseau')
      setShowToast(true)
    }
    setModalVisible(false)
    setProcessusToDelete(null)
  }

  // Filtrage des processus
  const processusFiltres = processus.filter(p => {
    // Filtre par nom
    const nomMatch = filterNom.trim() === '' || p.nom.toLowerCase().includes(filterNom.trim().toLowerCase());
    // Filtre par catégorie
    const catMatch = filterCategorie === '' || p.idCategorieProcessus === Number(filterCategorie);
    // Filtre par année de validité : si aucun filtre, ok; sinon garder si l'une des validites contient l'année
    const yearMatch = filterYear === '' || (Array.isArray(p.validites) && p.validites.some(v => Number(v.annee) === Number(filterYear)));
    return nomMatch && catMatch && yearMatch;
  });

  const processusParCategorie = categories.map(cat => ({
    categorie: cat.nom,
    id: cat.id,
    color: categorieColors[cat.id] || 'light',
    processusList: processusFiltres
      .filter(p => p.idCategorieProcessus === cat.id)
      .map(p => ({
        id: p.id,
        title: `${p.nom} (${p.sigle})`,
        responsable: Array.isArray(p.pilotes)
          ? p.pilotes.map(pi => pi.collaborateur?.poste).filter(Boolean).join(', ')
          : "-",
        collaborateur: Array.isArray(p.copilotes)
          ? p.copilotes.map(co => co.collaborateur?.poste).filter(Boolean).join(', ')
          : "-",
        onDelete: () => askDeleteProcessus(p.id),
        onEdit: () => navigate(`/pilotage/cartographie/formprocessus/${p.id}`),
        onClick: () => navigate(`/pilotage/cartographie/ficheprocessus/${p.id}`),
      })),
  }));

  return (
    <>
      <Pop_up
        show={showToast}
        setShow={setShowToast}
        type={popType}
        message={popMessage}
      />
      {/* Modal de confirmation suppression */}
      <CModal
        alignment="center"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        aria-labelledby="deleteProcessusModal"
      >
        <CModalHeader>
          <CModalTitle id="deleteProcessusModal" className="d-flex align-items-center">
            <CIcon icon={cilWarning} className="me-4 text-danger" size='lg' />
            <span className="text-danger">Confirmation</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          Voulez-vous vraiment supprimer ce processus ?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Non
          </CButton>
          <CButton color="danger" onClick={confirmDeleteProcessus}>
            Oui
          </CButton>
        </CModalFooter>
      </CModal>
      <CRow>
        <CCol xs={3} className="d-flex justify-content-start"></CCol>
        <CCol xs={6} className="d-flex justify-content-center">
          <h3>Cartographie des processus</h3>
        </CCol>
        <CCol xs={3} className="d-flex justify-content-end">
          <CButton
            color='primary'
            key='1'
            className="mb-3"
            href='#/pilotage/cartographie/formprocessus'
          >
            <CIcon icon={cilPlus} className="me-2" />
            Nouvelle processus
          </CButton>
        </CCol>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Filtre</strong> 
            </CCardHeader>
            <CCardBody> 
              <CForm className="row g-3" onSubmit={e => {
                e.preventDefault();
                setFilterNom(inputNom);
                setFilterCategorie(inputCategorie);
                setFilterYear(inputYear);
              }}>
                <CCol xs={4}>
                  <CFormInput
                    type="text"
                    id="floatingInput"
                    floatingClassName="mb-0"
                    floatingLabel="Processus"
                    placeholder="Nom du processus"
                    value={inputNom}
                    onChange={e => setInputNom(e.target.value)}
                  />
                </CCol>
                <CCol xs={4}>
                  <CategorieProcessusSelect 
                    id="floatingInput"
                    floatingClassName="mb-0"
                    floatingLabel="Catégorie Processus"
                    value={inputCategorie}
                    onChange={e => setInputCategorie(e.target.value)}
                    allowEmpty={true}
                    emptyLabel="Tous"
                  />
                </CCol>
                <CCol xs={2}>
                  <CFormSelect
                    aria-label="Année de validité"
                    floatingLabel="Année"
                    value={inputYear}
                    onChange={e => setInputYear(e.target.value)}
                    className="mb-0"
                  >
                    <option value="">Toutes les années</option>
                    {availableYears.map(y => (
                      <option key={y} value={String(y)}>{y}</option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol xs={2} className="d-flex justify-content-center align-items-center">
                  <CButton
                    className='me-1'
                    color='danger'
                    key='2'
                    type='button'
                    onClick={() => {
                      setInputNom('')
                      setInputCategorie('')
                      setInputYear('')
                      setFilterNom('')
                      setFilterCategorie('')
                      setFilterYear('')
                    }}
                  >
                   <CIcon icon={cilFilterX} />
                  </CButton>
                  <CButton
                    color='primary'
                    key='1'
                    type='submit'
                  >
                    <CIcon icon={cilFilter} className="me-2" />
                    Filtrer
                  </CButton>
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
          {/* Legend for category colors */}
          <div className="mb-3 d-flex align-items-center gap-3">
            <span className='mb-0 h6'>Légende :</span>
            {categories.map(cat => (
              <div key={cat.id} className="d-flex align-items-center" title={cat.nom}>
                <span style={{ width: 36, height: 18, display: 'inline-block', background: categorieColors[cat.id] || '#eee', borderRadius: 4, marginRight: 8, border: '1px solid rgba(0,0,0,0.08)' }} />
                <span className="text-muted" style={{ fontSize: 14 }}>{cat.nom}</span>
              </div>
            ))}
          </div>
        </CCol>
      </CRow>
      <CCard className="p-4 mb-4">
        {processusParCategorie.map(cat =>
          cat.processusList.length > 0 && (
            <CategorieProcessusSection
              key={cat.id}
              categorie={cat.categorie}
              processusList={cat.processusList}
              color={cat.color}
            />
          )
        )}
      </CCard>
    </>
  )
}

export default Cartographie
