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
import axiosInstance from '../../../api/axiosInstance'
import CategorieProcessusSelect from '../../../components/champs/CategorieProcessusSelect'
import { Pop_up } from '../../../components/notification/Pop_up' // Ajoute l'import

const Cartographie = () => {
  const [processus, setProcessus] = useState([])
  const [categories, setCategories] = useState([])
  // Etats pour le filtre
  const [inputNom, setInputNom] = useState('')
  const [inputCategorie, setInputCategorie] = useState('')
  const currentYear = new Date().getFullYear()
  const [inputYear, setInputYear] = useState(String(currentYear))
  const [filterNom, setFilterNom] = useState('')
  const [filterCategorie, setFilterCategorie] = useState('')
  const [filterYear, setFilterYear] = useState(String(currentYear))
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
    // Récupérer les processus via la nouvelle route cartographie
    axiosInstance.get('/Processus/cartographie')
      .then(res => setProcessus(res.data || []))
      .catch(() => setProcessus([]))

    // Récupérer les catégories
    axiosInstance.get('/CategorieProcessus')
      .then(res => setCategories(res.data || []))
      .catch(() => setCategories([]))
  }, [])

  // Build available years list from processus.validites; fall back to sensible defaults
  useEffect(() => {
    const years = new Set()
    processus.forEach(p => {
      if (Array.isArray(p.validites)) {
        p.validites.forEach(v => { if (v && v.annee) years.add(Number(v.annee)) })
      }
    })
    const sorted = Array.from(years).sort((a, b) => a - b)
    const now = new Date().getFullYear()
    let finalYears = []
    if (sorted.length === 0) {
      finalYears = [now, now + 1, now + 2]
    } else {
      finalYears = sorted.includes(now) ? sorted : [now, ...sorted]
    }
    setAvailableYears(finalYears)
  }, [processus])

  const categorieColors = {
    1: '#A8D5BA',
    2: '#8aa8c8ff',
    3: '#c7d3e7ff',
    4: '#E0E0E0',
  }

  // Demande la confirmation avant suppression
  const askDeleteProcessus = (id) => {
    console.debug('askDeleteProcessus called with id', id)
    setProcessusToDelete(id)
    setModalVisible(true)
    // // quick visual feedback to confirm the click reached the handler
    // setPopType('info')
    // setPopMessage(`Suppression demandée pour le processus ${id}`)
    // setShowToast(true)
  }

  // Supprime le processus après confirmation
  const confirmDeleteProcessus = async () => {
    if (!processusToDelete) return
    try {
      console.debug('Deleting processus', processusToDelete)
      const res = await axiosInstance.delete(`/Processus/${processusToDelete}`)
      console.debug('Delete response', res)
      if (!res || (res.status && res.status >= 400)) {
        setPopType('danger')
        setPopMessage('Erreur lors de la suppression')
        setShowToast(true)
      } else {
        // Re-fetch the processus list to keep state consistent with server
        try {
          const listRes = await axiosInstance.get('/Processus/cartographie')
          setProcessus(listRes.data || [])
        } catch (fetchErr) {
          // Fallback to local removal if re-fetch fails
          console.error('Erreur lors du rechargement des processus après suppression', fetchErr)
          setProcessus(prev => prev.filter(p => p.id !== processusToDelete))
        }
        setPopType('success')
        setPopMessage('Processus supprimé avec succès')
        setShowToast(true)
      }
    } catch (err) {
      console.error('Erreur lors de la suppression du processus', err)
      const message = err?.response?.data?.message || err?.message || 'Erreur lors de la suppression'
      setPopType('danger')
      setPopMessage(message)
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
        // Prefer dynamic responsablesProcessus: return an array of postes (no role labels)
        responsable: (Array.isArray(p.responsablesProcessus) && p.responsablesProcessus.length > 0)
          ? (p.responsablesProcessus || []).map(rp => rp.collaborateur?.poste).filter(Boolean)
          // Fallback to old pilotes list as an array
          : (Array.isArray(p.pilotes)
            ? p.pilotes.map(pi => pi.collaborateur?.poste).filter(Boolean)
            : ["-"]),
        onDelete: () => askDeleteProcessus(p.id),
        onEdit: () => navigate(`/cartographie/formprocessus/${p.id}`),
        onClick: () => navigate(`/cartographie/ficheprocessus/${p.id}`),
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
            href='/cartographie/formprocessus'
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
